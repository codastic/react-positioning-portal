import * as React from 'react';
import { useArgs } from '@storybook/client-api';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import scrollable from '../storybook/decorators/scrollable';
import { extendStory } from '../storybook/utils';
import { Transition } from 'react-transition-group';

import Button from '../storybook/Button';
import Flyout from '../storybook/Flyout';

import PositioningPortal, {
  defaultPositionStrategy,
  PositioningStrategy,
} from './PositioningPortal';

export default {
  title: 'PositioningPortal',
  component: PositioningPortal,
  decorators: [
    (story, context) => {
      const [, updateArgs] = useArgs();

      return story({
        args: {
          ...context.args,
          onOpen: () => updateArgs({ isOpen: true }),
          onClose: () => updateArgs({ isOpen: false }),
          onShouldClose: () => updateArgs({ isOpen: false }),
          children: (
            <Button type="button" onClick={() => updateArgs({ isOpen: true })}>
              Open portal
            </Button>
          ),
        },
      });
    },
  ],
} as ComponentMeta<typeof PositioningPortal>;

export const Base: ComponentStory<typeof PositioningPortal> = (args) => {
  return <PositioningPortal {...args} />;
};
Base.args = {
  children: null,
  isOpen: false,
  positionStrategy: defaultPositionStrategy as PositioningStrategy<unknown>,
  portalContent: ({ close }) => (
    <Flyout>
      Flyout positioned with portal.
      <Button type="button" onClick={close}>
        Close flyout
      </Button>
    </Flyout>
  ),
};

export const ScrollableTest = extendStory(Base);
ScrollableTest.decorators = [scrollable];

export const WithAnimation = extendStory(Base, {
  portalContent: ({
    isOpen,
    isPositioned,
    transitionStarted,
    transitionEnded,
    close,
  }) => (
    <Transition<undefined>
      addEndListener={(node, done) => {
        node.addEventListener('transitionend', done, false);
      }}
      in={isOpen && isPositioned}
      onEnter={transitionStarted}
      onExited={transitionEnded}
    >
      {(state) => (
        <Flyout state={state}>
          Flyout positioned with portal.
          <Button type="button" onClick={close}>
            Close flyout
          </Button>
        </Flyout>
      )}
    </Transition>
  ),
});

export const SameWidthAsParent = extendStory(Base, {
  portalContent: ({ close, relatedWidth }) => (
    <Flyout relatedWidth={relatedWidth}>
      Flyout positioned with portal.
      <Button type="button" onClick={close}>
        Close flyout
      </Button>
    </Flyout>
  ),
});

export const NoClickOutsideClose = extendStory(Base, {
  closeOnOutsideClick: false,
});

export const CloseOnKeydownQ = extendStory(Base, {
  closeOnKeyDown: (event: KeyboardEvent) => event.code === 'KeyQ',
});
