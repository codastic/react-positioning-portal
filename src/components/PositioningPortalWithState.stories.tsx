import * as React from 'react';
import { action } from '@storybook/addon-actions';

import PositioningPortalWithState from './PositioningPortalWithState';

export default {
  title: 'PositioningPortalWithState'
};

export const base = () => (
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
);
