import * as React from 'react';
import { action } from '@storybook/addon-actions';

import Button from '../storybook/Button';
import Flyout from '../storybook/Flyout';
import { globalStyleDecorator } from '../storybook/decorators';

import PositioningPortalWithState from './PositioningPortalWithState';

export default {
  title: 'PositioningPortalWithState',
  decorators: [globalStyleDecorator]
};

export const base = () => (
  <PositioningPortalWithState
    onOpen={action('onOpen')}
    onClose={action('onClose')}
    portalContent={({ close }) => (
      <Flyout>
        Flyout positioned with portal.
        <Button type="button" onClick={close}>
          Close flyout
        </Button>
      </Flyout>
    )}
  >
    {({ open, close, isOpen }) => (
      <Button type="button" onClick={isOpen ? close : open}>
        {isOpen ? 'Close' : 'Open'} portal
      </Button>
    )}
  </PositioningPortalWithState>
);
