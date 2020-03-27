import * as React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { withState, Store } from '@dump247/storybook-state';

import Button from '../storybook/Button';
import { COLORS } from '../storybook/styles';
import { globalStyleDecorator } from '../storybook/decorators';

import PositioningPortal, { PositioningStrategy } from './PositioningPortal';

enum POSITION {
  TOP = 'top',
  LEFT = 'left',
  RIGHT = 'right',
  BOTTOM = 'bottom'
}

const StyledTooltip = styled.div`
  display: inline-block;
  max-width: 260px;
  position: relative;
  background-color: ${COLORS.primary};
  color: ${COLORS.textInvert};
  padding: 16px;
  border-radius: 4px;
`;

interface Props {
  children: React.ReactNode;
  position: POSITION;
  shift: number;
}

const StyledTooltipArrow = styled.div<{ position: POSITION; shift: number }>`
  position: absolute;
  width: 0;
  height: 0;

  ${props =>
    props.position === POSITION.TOP &&
    `
      top: 100%;
      left: 50%;
      margin-left: -10px;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid ${COLORS.primary};
  `}

  ${props =>
    props.position === POSITION.BOTTOM &&
    `
      top: auto;
      bottom: 100%;
      left: 50%;
      margin-left: -10px;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid ${COLORS.primary};
  `}

  ${props =>
    props.position === POSITION.LEFT &&
    `
      left: 100%;
      top: 50%;
      margin-top: -10px;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 10px solid ${COLORS.primary};
  `}

  ${props =>
    props.position === POSITION.RIGHT &&
    `
      left: auto;
      top: 50%;
      right: 100%;
      margin-top: -10px;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-right: 10px solid ${COLORS.primary};
  `}

  ${props =>
    (props.position === POSITION.TOP || props.position === POSITION.BOTTOM) &&
    `
      transform: translateX(${-props.shift}px);
    `}

  ${props =>
    (props.position === POSITION.LEFT || props.position === POSITION.RIGHT) &&
    `
      transform: translateY(${-props.shift}px);
    `}
`;

const Tooltip = ({ children, position = POSITION.TOP, shift = 0 }: Props) => {
  return (
    <StyledTooltip>
      {children}
      <StyledTooltipArrow position={position} shift={shift} />
    </StyledTooltip>
  );
};

const positionStrategy: (
  preferredPosition: POSITION
) => PositioningStrategy<{
  position: POSITION;
  shift: number;
}> = preferredPosition => (parentRect, portalRect) => {
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;
  const body = window.document.documentElement || window.document.body;

  const horizontalCenter = (parentRect.width - portalRect.width) / 2;
  const verticalCenter = (parentRect.height - portalRect.height) / 2;
  const additionalPadding = 15;

  const positions = {
    [POSITION.BOTTOM]: {
      position: POSITION.BOTTOM,
      top: parentRect.top + parentRect.height + scrollY + additionalPadding,
      left: parentRect.left + scrollX + horizontalCenter,
      enoughSpace:
        parentRect.top +
          parentRect.height +
          portalRect.height +
          additionalPadding <
        body.clientHeight
    },
    [POSITION.TOP]: {
      position: POSITION.TOP,
      top: parentRect.top - portalRect.height + scrollY - additionalPadding,
      left: parentRect.left + scrollX + horizontalCenter,
      enoughSpace: parentRect.top - portalRect.height - additionalPadding > 0
    },
    [POSITION.LEFT]: {
      position: POSITION.LEFT,
      top: parentRect.top + scrollY + verticalCenter,
      left: parentRect.left + scrollX - portalRect.width - additionalPadding,
      enoughSpace: parentRect.left - portalRect.width - additionalPadding > 0
    },
    [POSITION.RIGHT]: {
      position: POSITION.RIGHT,
      top: parentRect.top + scrollY + verticalCenter,
      left: parentRect.left + scrollX + parentRect.width + additionalPadding,
      enoughSpace:
        parentRect.left +
          parentRect.width +
          portalRect.width +
          additionalPadding <
        body.clientWidth
    }
  };

  // Horizontal fallback preferred
  let sortedPositions = [
    positions[preferredPosition],
    positions[POSITION.BOTTOM],
    positions[POSITION.TOP],
    positions[POSITION.RIGHT],
    positions[POSITION.LEFT]
  ];

  // Vertical fallback preferred
  if (
    preferredPosition === POSITION.LEFT ||
    preferredPosition === POSITION.RIGHT
  ) {
    sortedPositions = [
      positions[preferredPosition],
      positions[POSITION.RIGHT],
      positions[POSITION.LEFT],
      positions[POSITION.BOTTOM],
      positions[POSITION.TOP]
    ];
  }

  const pickedPosition =
    sortedPositions.find(({ enoughSpace }) => enoughSpace) ||
    positions[preferredPosition];

  const finalTop = Math.max(
    Math.min(
      pickedPosition.top,
      body.clientHeight + scrollY - portalRect.height
    ),
    scrollY
  );
  const shiftY = Math.max(
    Math.min(
      finalTop - pickedPosition.top,
      portalRect.height / 2 - additionalPadding
    ),
    portalRect.height / -2 + additionalPadding
  );

  const finalLeft = Math.max(
    Math.min(
      pickedPosition.left,
      body.clientWidth + scrollX - portalRect.width
    ),
    scrollX
  );
  const shiftX = Math.max(
    Math.min(
      finalLeft - pickedPosition.left,
      portalRect.width / 2 - additionalPadding
    ),
    portalRect.width / -2 + additionalPadding
  );

  return {
    top: Math.max(
      Math.min(
        pickedPosition.top,
        body.clientHeight + scrollY - portalRect.height
      ),
      scrollY
    ),
    left: Math.max(
      Math.min(
        pickedPosition.left,
        body.clientWidth + scrollX - portalRect.width
      ),
      scrollX
    ),
    strategy: {
      position: pickedPosition.position,
      shift:
        pickedPosition.position === 'top' ||
        pickedPosition.position === 'bottom'
          ? shiftX
          : shiftY
    }
  };
};

export default {
  title: 'Example: Tooltip',
  decorators: [globalStyleDecorator]
};

export const base = withState(
  { isOpen: false },
  (store: Store<{ isOpen: boolean }>) => (
    <div style={{ margin: '95vh 95vw', display: 'inline-block' }}>
      <PositioningPortal
        positionStrategy={positionStrategy(POSITION.RIGHT)}
        isOpen={store.state.isOpen}
        onOpen={action('onOpen')}
        onShouldClose={() => store.set({ isOpen: false })}
        portalContent={({ strategy }) => (
          <Tooltip
            position={strategy ? strategy.position : undefined}
            shift={strategy ? strategy.shift : undefined}
          >
            Tooltip positioned with portal.
          </Tooltip>
        )}
      >
        <Button
          type="button"
          onMouseEnter={() => store.set({ isOpen: true })}
          onMouseLeave={() => store.set({ isOpen: false })}
        >
          Open Tooltip
        </Button>
      </PositioningPortal>
    </div>
  )
);

export const preferredPositionTop = withState(
  { isOpen: false },
  (store: Store<{ isOpen: boolean }>) => (
    <div style={{ margin: '95vh 95vw', display: 'inline-block' }}>
      <PositioningPortal
        positionStrategy={positionStrategy(POSITION.TOP)}
        isOpen={store.state.isOpen}
        onOpen={action('onOpen')}
        onShouldClose={() => store.set({ isOpen: false })}
        portalContent={({ strategy }) => (
          <Tooltip
            position={strategy ? strategy.position : undefined}
            shift={strategy ? strategy.shift : undefined}
          >
            Tooltip positioned with portal.
          </Tooltip>
        )}
      >
        <Button
          type="button"
          onMouseEnter={() => store.set({ isOpen: true })}
          onMouseLeave={() => store.set({ isOpen: false })}
        >
          Open Tooltip
        </Button>
      </PositioningPortal>
    </div>
  )
);
