# React Positioning Portal

[![Build Status](https://travis-ci.org/codastic/react-positioning-portal.svg?branch=master)](https://travis-ci.org/codastic/react-positioning-portal)
![NPM](https://img.shields.io/npm/l/@codastic/react-positioning-portal)

The positioning portal is a low level React component to build all kinds of
absolutely positioned flyouts which are anchored to another element in the viewport.
This can be used to create dropdowns, tooltips, context menus, etc.

The positioning portal is build as unopinionated as possible which means, it creates only mininmal DOM
and does not have any dependencies to specific styling libraries. It only uses some inline styles on the portal for positioning.

How the portal is positioned in relation to its anchor in the DOM is defined by a _positioning strategy_.
The default positioning strategy should be enough for a lot of use cases. It either positions the portal above
(left or right aligned) to the anchor or below depending on the available space in the current viewport.
This default strategy is perfectly suited to build e.g. custom dropdowns.

It is also possible to overwrite the positioning strategy.
An example for a tooltip is shown in [storybook](https://codastic.github.io/react-positioning-portal/?path=/story/example-tooltip--base).

See [storybook](https://codastic.github.io/react-positioning-portal/) for more examples.

## Installation

```
$ npm install @codastic/react-positioning-portal react react-dom --save
```

## Usage

Basic usage of `<PositioningPortal />` where state is handled outside.

```
const [isPortalOpen, setIsPortalOpen] = useState(false);

//…

<PositioningPortal
  isOpen={isPortalOpen}
  onOpen={() => setIsPortalOpen(true)}
  onShouldClose={() => setIsPortalOpen(false)}
  portalContent={
    <div>
      Portal content goes here.
      <button type="button" onClick={() => setIsPortalOpen(false)}>
        Close
      </button>
    </div>
  }
>
  <button type="button" onClick={() => setIsPortalOpen(true)}>
    Open portal
  </button>
</PositioningPortal>
```

Basic usage of `<PositioningPortalWithState />` which handles state inside.

```
<PositioningPortalWithState
  portalContent={
    <div>
      Portal content goes here.
    </div>
  }
>
  {({ open}) => (
    <button type="button" onClick={open}>
      Open portal
    </button>
  )}
</PositioningPortalWithState>
```

## Features

### `<PositioningPortal />`

- Supports custom positioning strategies.
- State handled outside the PositioningPortal.
- Handles outside click to close the portal.
- Handles key down to close the portal.
- Portal transitions when opening and closing.
- Define a custom root node for the portal.

### `<PositioningPortalWithState />`

This component is almost feature equivalent to `<PositioningPortal />` with the exception that
the `isOpen` state is already handled by the component itself. So if you don't have to control this state outside
it can be easier to use `<PositioningPortalWithState />` and let it handle the state itself.

## API Reference

### `<PositioningPortal />`

- `children: React.ReactNode`:

  The PositioningPortal component takes the portal's anchor element as children. Its `width` is passed to the `portalContent` render prop argument `relatedWidth`.

- `portalElement?: React.ReactElement`: (default: `<div />`)

  The `portalElement` wraps the `portalContent`. When rendering the `portalContent` the PositioningPortal appends
  the styles `position`, `width`, `left`, `top` and `visibility` to the `portalElement`. By defining your own styles on the `portalElement` you can overwrite those styles. E.g. if you prefer a fixed position for the portal you can
  do the following:

  ```
    <PositioningPortal
      portalElement={<div style={{ position: 'fixed' }} />}
    >
    // ...
  ```

- `portalContent: React.ReactNode | ((params: PortalContentRenderProps<Strategy>) => React.ReactNode);`:

  Actual content rendered when the portal is open. `portalContent` can be any react node or a function
  returning a react node. The function receives the following props:

  ```
  interface PortalContentRenderProps<Strategy> {
    close: () => void; // Basically calls the handler passed to onShouldClose
    isOpen: boolean;
    isPositioned: boolean; // Becomes true after the portalContent is positioned and visible
    strategy: Strategy; // Whatever the positionStrategy returns
    relatedWidth: number; // The width of the PositioningPortal children
    transitionStarted: () => void; // Signals that there is a transition
    transitionEnded: () => void; // Should be called when the portal can safely be removed from the DOM
  }
  ```

- `onOpen: () => void`:

  Will be called after the portal content is positioned and visible.

- `onClose?: () => void`

  Callback when portal closes.

- `onShouldClose?: () => void`:

  This gets called if `PortalContentRenderProps.close` gets called, by clicking outside the portal content (in case `closeOnOutsideClick` is true) or if `closeOnKeyDown` returns true.

- `closeOnOutsideClick?: boolean`: (default: `true`)

  If set to `true`, `onShouldClose` gets called by clicking outside the portal content.

- `closeOnKeyDown?: (event: KeyboardEvent) => boolean`: (default: `event => event.keyCode === 27`, close on ESC)

  A function, which will be called on `keydown`. If it returns `true`, the handler passed to `onShouldClose` will be called.

- `isOpen?: boolean`:

  Sets the PositioningPortal to be open or closed.

- `positionStrategy?: PositioningStrategy<Strategy>`:

  Sets a custom PositioningStrategy. For details see the PositioningStrategy section.

- `rootNode?: HTMLElement`:

  Pass a custom root node for the portal to be added to.

### `<PositioningPortalWithState />`

Extends properties of `<PositioningPortal />` and adds/changes the folling properties:

- `children: React.ReactNode | ((params: RenderProps) => React.ReactNode)`:

  Since state is handled inside of the component, it is possible to render the children via a render function and to receive the following render props:

  ```
  interface RenderProps {
    close: () => void;
    open: () => void;
    isOpen: boolean;
  }
  ```

### PositioningStrategy

The positioning strategy is a function which receives the rectangle of the parent anchor element `parentRect` relative to the viewport (measured with `getBoundingClientRect()`)
and the rectangle for the portal. During the first render phase the portal is rendered invisible until the positioning strategy has been called.

The strategy function should return the position for the portal (`top` and `left`). I can optionally return other arbitrary data (`strategy`) which can be used to customize the rendering of the portal.
E.g. to define which orientation the arrow of a tooltip should have.

```
const positionStrategy (
  parentRect,
  portalRect
  props
) => {
  // Compute where the portal should be positioned...

  return {
    top,
    left,
    strategy
  };
};
```

This is the type definition of a positioning strategy:

```
export type PositioningStrategy<Strategy> = (
  parentRect: ClientRect,
  portalRect: ClientRect,
  props: Props<Strategy>
) => {
  top: number;
  left: number;
  strategy: Strategy;
};
```

## Examples

- [Basic portal opened by a button.](https://codastic.github.io/react-positioning-portal/?path=/story/positioningportal--base)
- [Basic portal animated with](https://codastic.github.io/react-positioning-portal/?path=/story/positioningportal--with-animation) [react-transition-group](https://github.com/reactjs/react-transition-group).
- [A portal with the same width as the anchor element.](https://codastic.github.io/react-positioning-portal/?path=/story/positioningportal--same-width-as-parent)
- [Disable close on click outside](https://codastic.github.io/react-positioning-portal/?path=/story/positioningportal--no-click-outside-close)
- [Close portal on key down.](https://codastic.github.io/react-positioning-portal/?path=/story/positioningportal--close-on-keydown-q)

- [Basic tooltip with state handeled inside](https://codastic.github.io/react-positioning-portal/?path=/story/positioningportalwithstate--base)
- [Simple Tooltop](https://codastic.github.io/react-positioning-portal/?path=/story/example-tooltip--base)
- [Tooltip with a preferred position](https://codastic.github.io/react-positioning-portal/?path=/story/example-tooltip--preferred-position-top)
