import React from 'react';
import { action } from '@storybook/addon-actions';
import { withState } from '@dump247/storybook-state';

import PositioningPortalWithState from './PositioningPortalWithState';

export default {
  title: 'PositioningPortalWithState'
};

export const base = withState({ isOpen: false }, store => (
  <PositioningPortalWithState
    onOpen={action('onOpen')}
    onClose={action('onClose')}
    portalContent={({ close }) => (
      <button
        type="button"
        onClick={close}
        style={{ width: '20em', height: '10em', border: '1px solid blue' }}
      >
        Close portal
      </button>
    )}
  >
    {({ open, close, isOpen }) => (
      <button type="button" onClick={isOpen ? close : open}>
        {isOpen ? 'Close' : 'Open'} portal
      </button>
    )}
  </PositioningPortalWithState>
));
