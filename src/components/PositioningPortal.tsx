import * as React from 'react';
import * as ReactDOM from 'react-dom';

import getScrollParents from '../services/scroll-parents';
import noop from '../services/noop';

export interface Props<Strategy> {
  children: React.ReactNode;
  portalElement?: React.ReactElement;
  portalContent:
    | React.ReactNode
    | ((params: PortalContentRenderProps<Strategy>) => React.ReactNode);
  onOpen?: () => void;
  onClose?: () => void;
  onShouldClose?: () => void;
  closeOnScroll?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnKeyDown?: (event: KeyboardEvent) => boolean;
  isOpen?: boolean;
  positionStrategy?: PositioningStrategy<Strategy>;
  rootNode?: HTMLElement;
}

export interface PortalContentRenderProps<Strategy> {
  close: () => void;
  isOpen: boolean;
  isPositioned: boolean;
  strategy: Strategy;
  relatedWidth: number;
  relatedHeight: number;
  transitionStarted: () => void;
  transitionEnded: () => void;
}

export type PositioningStrategy<Strategy> = (
  parentRect: ClientRect,
  portalRect: ClientRect,
  props: Props<Strategy>
) => {
  top: number;
  left: number;
  strategy: Strategy;
};

export enum Position {
  ABOVE_LEFT = 'ABOVE_LEFT',
  ABOVE_RIGHT = 'ABOVE_RIGHT',
  BELOW_LEFT = 'BELOW_LEFT',
  BELOW_RIGHT = 'BELOW_RIGHT',
}

const renderProps: <Strategy>(
  element: Props<Strategy>['portalContent'],
  props: PortalContentRenderProps<Strategy>
) => React.ReactNode = (element, props) =>
  typeof element === 'function' ? element(props) : element;

export const defaultPositionStrategy: PositioningStrategy<Position> = (
  parentRect: ClientRect,
  portalRect: ClientRect
  /* props: Props<Position> */
) => {
  // Open the content portal above the child if there is not enough space to the bottom,
  // but if there also isn't enough space at the top, open to the bottom.
  const openAbove =
    parentRect.top + parentRect.height + portalRect.height >
      (window.document.documentElement || window.document.body).clientHeight &&
    parentRect.top - portalRect.height > 0;

  const top = openAbove
    ? parentRect.top - portalRect.height + window.scrollY
    : parentRect.top + parentRect.height + window.scrollY;

  // Open the content portal to the left if there is not enough space at the right,
  // but if there also isn't enough space at the right, open to the left.
  const alignRight =
    parentRect.left + portalRect.width >
      (window.document.documentElement || window.document.body).clientWidth &&
    parentRect.left - portalRect.width > 0;

  const left = !alignRight
    ? parentRect.left + window.scrollX
    : window.scrollX + parentRect.left - portalRect.width + parentRect.width;

  let strategy = Position.BELOW_RIGHT;
  if (openAbove && alignRight) {
    strategy = Position.ABOVE_LEFT;
  }
  if (openAbove && !alignRight) {
    strategy = Position.ABOVE_RIGHT;
  }
  if (!openAbove && alignRight) {
    strategy = Position.BELOW_LEFT;
  }
  if (!openAbove && !alignRight) {
    strategy = Position.BELOW_RIGHT;
  }

  return {
    top,
    left,
    strategy,
  };
};

interface State<Strategy> {
  top?: number;
  left?: number;
  portalRect?: ClientRect | DOMRect;
  parentRect?: ClientRect | DOMRect;
  isPositioned: boolean;
  isOpen: boolean;
  transitionActive: boolean;
  shouldRender: boolean;
  scrollParents: Array<HTMLElement | Window>;
  strategy?: Strategy;
}

const KEYCODES = {
  ESCAPE: 27,
};

const EVENT_CONTEXT_KEY = 'PositioningPortal-context';

class PositioningPortal<Strategy = Position> extends React.Component<
  Props<Strategy>,
  State<Strategy>
> {
  public static defaultProps = {
    isOpen: false,
    closeOnScroll: true,
    onOpen: noop,
    onClose: noop,
    onShouldClose: noop,
    closeOnOutsideClick: true,
    closeOnKeyDown: (event: KeyboardEvent) => event.keyCode === KEYCODES.ESCAPE,
    positionStrategy: defaultPositionStrategy,
  };

  public state: State<Strategy> = {
    top: null,
    left: null,
    portalRect: null,
    parentRect: null,
    isPositioned: false,
    isOpen: false,
    transitionActive: false,
    shouldRender: false,
    scrollParents: [],
    strategy: null,
  };

  private portalRef = React.createRef<HTMLDivElement>();

  public componentDidMount() {
    window.document.addEventListener('keydown', this.handleKeydown, false);
    window.document.addEventListener(
      'click',
      this.handleOutsideMouseClick,
      false
    );

    // Do not render on server side.
    this.setState({ shouldRender: true });

    if (this.props.isOpen) {
      this.onOpen();
    }
  }

  public componentDidUpdate(prevProps: Props<Strategy>) {
    if (this.props.isOpen !== prevProps.isOpen) {
      if (this.props.isOpen) {
        this.onOpen();
      } else {
        this.onClose();
      }
    }
  }

  public componentWillUnmount() {
    window.document.removeEventListener('keydown', this.handleKeydown, false);
    window.document.removeEventListener(
      'click',
      this.handleOutsideMouseClick,
      false
    );

    // Remove scroll event listeners
    if (this.props.closeOnScroll) {
      this.state.scrollParents.forEach((node) =>
        node.removeEventListener('scroll', this.close, false)
      );
    }
  }

  public close = () => {
    if (this.props.onShouldClose) {
      this.props.onShouldClose();
    }
  };

  public transitionStarted = () => {
    this.setState({ transitionActive: true });
  };

  public transitionEnded = () => {
    this.setState({ transitionActive: false });
  };

  private handleOutsideMouseClick = (
    event: MouseEvent & {
      [EVENT_CONTEXT_KEY]?: PositioningPortal<Strategy>[];
    }
  ) => {
    if (!this.props.closeOnOutsideClick) {
      return;
    }

    if (!this.state.isOpen) {
      return;
    }

    if (
      this.portalRef.current &&
      this.portalRef.current.contains(event.target as Node)
    ) {
      return;
    }

    if ((event[EVENT_CONTEXT_KEY] || []).includes(this)) {
      return;
    }

    const parentDom = ReactDOM.findDOMNode(this);
    if (parentDom && parentDom.contains(event.target as Node)) {
      return;
    }

    this.close();
  };

  private handleKeydown = (event: KeyboardEvent) => {
    if (
      this.state.isOpen &&
      this.props.closeOnKeyDown &&
      this.props.closeOnKeyDown(event)
    ) {
      this.close();
    }
  };

  private onOpen = () => {
    if (!this.state.isOpen) {
      // 1) Prerender portal to get stable portal rect.
      this.preRenderPortal()
        // 2) Position portal with positioning strategy and trigger final render
        .then(this.finalRenderPortal)
        // 3) Communicate that portal has opened
        .then(() => {
          this.props.onOpen();
        });
    }
  };

  private onClose = () => {
    if (!this.state.isOpen) {
      return;
    }

    // Remove scroll event listeners
    this.state.scrollParents.forEach((node) =>
      node.removeEventListener('scroll', this.close, false)
    );

    this.setState({
      isOpen: false,
      scrollParents: [],
    });

    this.props.onClose();
  };

  private markClickEvent = (
    event: React.MouseEvent<
      HTMLElement,
      MouseEvent & {
        [EVENT_CONTEXT_KEY]?: PositioningPortal<Strategy>[];
      }
    >
  ) => {
    event.nativeEvent[EVENT_CONTEXT_KEY] = [
      ...(event.nativeEvent[EVENT_CONTEXT_KEY] || []),
      this,
    ];
  };

  private preRenderPortal = () =>
    new Promise<void>((resolve) => {
      // A tricky way to get the first child DOM element of the fragment of this component.
      // Unfortunately there seems to be no way to achieve this with refs.
      const parentDom = ReactDOM.findDOMNode(this);

      if (parentDom && parentDom.nodeType === Node.ELEMENT_NODE) {
        const parentRect = (parentDom as Element).getBoundingClientRect();

        let scrollParents: (HTMLElement | Window)[] = [];

        // Register scroll listener on all scrollable parents to close the portal on scroll
        if (this.props.closeOnScroll) {
          scrollParents = getScrollParents(parentDom as HTMLElement);
          scrollParents.forEach((node) =>
            node.addEventListener('scroll', this.close, false)
          );
        }

        this.setState(
          {
            isOpen: true,
            transitionActive: false,
            isPositioned: false,
            left: 0,
            top: 0,
            strategy: null,
            parentRect,
            portalRect: null,
            scrollParents,
          },
          resolve
        );
      } else {
        resolve();
      }
    });

  private finalRenderPortal = () =>
    new Promise<void>((resolve) => {
      if (
        this.state.isOpen &&
        !this.state.isPositioned &&
        this.portalRef.current &&
        this.state.parentRect
      ) {
        const portalRect = this.portalRef.current.getBoundingClientRect();

        const { top, left, strategy } = this.props.positionStrategy(
          this.state.parentRect,
          portalRect,
          this.props
        );

        this.setState(
          {
            isPositioned: true,
            left,
            strategy,
            top,
            portalRect,
          },
          resolve
        );
      } else {
        resolve();
      }
    });

  public render() {
    const { children, portalContent, portalElement, rootNode } = this.props;
    const {
      top,
      left,
      parentRect,
      portalRect,
      isPositioned,
      isOpen,
      strategy,
      transitionActive,
      shouldRender,
    } = this.state;
    const relatedWidth = parentRect ? parentRect.width : 0;
    const relatedHeight = parentRect ? parentRect.height : 0;

    const portalStyle = {
      position: 'absolute',
      width: portalRect ? `${portalRect.width}px` : 'auto',
      left: `${left}px`,
      top: `${top}px`,
      visibility: isPositioned ? 'visible' : 'hidden',
    };

    const renderPortal = () =>
      ReactDOM.createPortal(
        React.cloneElement(
          portalElement || <div />,
          {
            ref: this.portalRef,
            style: {
              ...portalStyle,
              ...((portalElement && portalElement.props.style) || {}),
            },
            onClick: this.markClickEvent,
          },
          renderProps<Strategy>(portalContent, {
            close: this.close,
            transitionStarted: this.transitionStarted,
            transitionEnded: this.transitionEnded,
            strategy,
            isOpen,
            isPositioned,
            relatedWidth,
            relatedHeight,
          })
        ),
        rootNode || window.document.body
      );

    const shouldRenderPortal = shouldRender && (isOpen || transitionActive);

    return (
      <>
        {children}
        {shouldRenderPortal && renderPortal()}
      </>
    );
  }
}

export default PositioningPortal;
