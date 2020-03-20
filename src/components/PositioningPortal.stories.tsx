import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { withState, Store } from '@dump247/storybook-state';

import PositioningPortal from './PositioningPortal';

export default {
  title: 'PositioningPortal'
};

const baseStory = (store: Store<{ isOpen: boolean }>) => (
  <PositioningPortal
    isOpen={store.state.isOpen}
    onOpen={action('onOpen')}
    onShouldClose={() => store.set({ isOpen: false })}
    portalContent={
      <button
        type="button"
        onClick={() => store.set({ isOpen: false })}
        style={{ width: '20em', height: '10em', border: '1px solid blue' }}
      >
        Close portal
      </button>
    }
  >
    <button type="button" onClick={() => store.set({ isOpen: true })}>
      Open portal
    </button>
  </PositioningPortal>
);

export const base = withState({ isOpen: false }, baseStory);

export const scrollableTest = withState({ isOpen: false }, store => (
  <div style={{ margin: '95vh 95vw', display: 'inline-block' }}>
    {baseStory(store)}
  </div>
));
