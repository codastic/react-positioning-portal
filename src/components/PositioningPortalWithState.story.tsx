import * as React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { defaultPositionStrategy, Position } from './PositioningPortal';

import PositioningPortalWithState, {
  RenderProps,
} from './PositioningPortalWithState';
import Button from '../storybook/Button';
import Flyout from '../storybook/Flyout';

export default {
  title: 'PositioningPortalWithState',
  component: PositioningPortalWithState,
} as ComponentMeta<typeof PositioningPortalWithState>;

export const Base: ComponentStory<PositioningPortalWithState<Position>> =
  function (args) {
    return <PositioningPortalWithState {...args} />;
  };
Base.args = {
  positionStrategy: defaultPositionStrategy,
  portalContent: ({ close }) => (
    <Flyout>
      Flyout positioned with portal.
      <Button type="button" onClick={close}>
        Close flyout
      </Button>
    </Flyout>
  ),
  children: ({ open, close, isOpen }: RenderProps) => (
    <Button onClick={isOpen ? close : open}>
      {isOpen ? 'Close portal' : 'Open portal'}
    </Button>
  ),
};
