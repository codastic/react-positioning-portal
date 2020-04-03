import * as React from 'react';
export interface Props<Strategy> {
    children: React.ReactNode;
    portalElement?: React.ReactElement;
    portalContent: React.ReactNode | ((params: PortalContentRenderProps<Strategy>) => React.ReactNode);
    onOpen?: () => void;
    onShouldClose?: () => void;
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
    transitionStarted: () => void;
    transitionEnded: () => void;
}
export declare type PositioningStrategy<Strategy> = (parentRect: ClientRect, portalRect: ClientRect, props: Props<Strategy>) => {
    top: number;
    left: number;
    strategy: Strategy;
};
export declare enum Position {
    ABOVE_LEFT = "ABOVE_LEFT",
    ABOVE_RIGHT = "ABOVE_RIGHT",
    BELOW_LEFT = "BELOW_LEFT",
    BELOW_RIGHT = "BELOW_RIGHT"
}
interface State<Strategy> {
    top?: number;
    left?: number;
    portalRect?: ClientRect | DOMRect;
    parentRect?: ClientRect | DOMRect;
    isPositioned: boolean;
    isOpen: boolean;
    transitionActive: boolean;
    scrollParents: HTMLElement[];
    strategy?: Strategy;
}
declare class PositioningPortal<Strategy = Position> extends React.Component<Props<Strategy>, State<Strategy>> {
    static defaultProps: {
        isOpen: boolean;
        onOpen: () => void;
        onShouldClose: () => void;
        closeOnOutsideClick: boolean;
        closeOnKeyDown: (event: KeyboardEvent) => boolean;
        positionStrategy: PositioningStrategy<Position>;
    };
    state: State<Strategy>;
    private portalRef;
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props<Strategy>): void;
    componentWillUnmount(): void;
    close: () => void;
    transitionStarted: () => void;
    transitionEnded: () => void;
    private handleOutsideMouseClick;
    private handleKeydown;
    private onOpen;
    private onClose;
    private preRenderPortal;
    private finalRenderPortal;
    render(): JSX.Element;
}
export default PositioningPortal;
