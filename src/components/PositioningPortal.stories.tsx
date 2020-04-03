import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { withState, Store } from '@dump247/storybook-state';
import { Transition } from 'react-transition-group';

import Button from '../storybook/Button';
import Flyout from '../storybook/Flyout';

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
      <Flyout>
        Flyout positioned with portal.
        <Button type="button" onClick={() => store.set({ isOpen: false })}>
          Close flyout
        </Button>
      </Flyout>
    }
  >
    <Button type="button" onClick={() => store.set({ isOpen: true })}>
      Open portal
    </Button>
  </PositioningPortal>
);

export const base = withState({ isOpen: false }, baseStory);

export const scrollableTest = withState({ isOpen: false }, store => (
  <div style={{ margin: '95vh 95vw', display: 'inline-block' }}>
    {baseStory(store)}
  </div>
));

export const withAnimation = withState(
  { isOpen: false },
  (store: Store<{ isOpen: boolean }>) => (
    <PositioningPortal
      isOpen={store.state.isOpen}
      onOpen={action('onOpen')}
      onShouldClose={() => store.set({ isOpen: false })}
      portalContent={({
        isOpen,
        isPositioned,
        transitionStarted,
        transitionEnded
      }) => (
        <Transition
          addEndListener={(node, done) => {
            node.addEventListener('transitionend', done, false);
          }}
          in={isOpen && isPositioned}
          onEnter={transitionStarted}
          onExited={transitionEnded}
        >
          {state => (
            <Flyout state={state}>
              Flyout positioned with portal.
              <Button
                type="button"
                onClick={() => store.set({ isOpen: false })}
              >
                Close flyout
              </Button>
            </Flyout>
          )}
        </Transition>
      )}
    >
      <Button type="button" onClick={() => store.set({ isOpen: true })}>
        Open portal
      </Button>
    </PositioningPortal>
  )
);

export const sameWidthAsParent = withState(
  { isOpen: false },
  (store: Store<{ isOpen: boolean }>) => (
    <PositioningPortal
      isOpen={store.state.isOpen}
      onOpen={action('onOpen')}
      onShouldClose={() => store.set({ isOpen: false })}
      portalContent={({ relatedWidth }) => (
        <Flyout relatedWidth={relatedWidth}>
          Flyout positioned with portal.
          <Button type="button" onClick={() => store.set({ isOpen: false })}>
            Close flyout
          </Button>
        </Flyout>
      )}
    >
      <Button type="button" onClick={() => store.set({ isOpen: true })}>
        Open portal which will have same width
      </Button>
    </PositioningPortal>
  )
);

export const noClickOutsideClose = withState(
  { isOpen: false },
  (store: Store<{ isOpen: boolean }>) => (
    <PositioningPortal
      closeOnOutsideClick={false}
      isOpen={store.state.isOpen}
      onOpen={action('onOpen')}
      onShouldClose={() => store.set({ isOpen: false })}
      portalContent={
        <Flyout>
          Flyout positioned with portal.
          <Button type="button" onClick={() => store.set({ isOpen: false })}>
            Close flyout
          </Button>
        </Flyout>
      }
    >
      <Button type="button" onClick={() => store.set({ isOpen: true })}>
        Open portal
      </Button>
    </PositioningPortal>
  )
);

export const closeOnKeydownEnter = withState(
  { isOpen: false },
  (store: Store<{ isOpen: boolean }>) => (
    <PositioningPortal
      closeOnKeyDown={(event: KeyboardEvent) => event.keyCode === 13}
      isOpen={store.state.isOpen}
      onOpen={action('onOpen')}
      onShouldClose={() => store.set({ isOpen: false })}
      portalContent={
        <Flyout>
          Flyout positioned with portal.
          <Button type="button" onClick={() => store.set({ isOpen: false })}>
            Close flyout
          </Button>
        </Flyout>
      }
    >
      <Button type="button" onClick={() => store.set({ isOpen: true })}>
        Open portal
      </Button>
    </PositioningPortal>
  )
);
