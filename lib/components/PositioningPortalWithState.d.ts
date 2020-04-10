import * as React from 'react';
import { Props as PositioningPortalProps, Position } from './PositioningPortal';
export interface RenderProps {
    close: () => void;
    open: () => void;
    isOpen: boolean;
}
export interface Props<Strategy = Position> extends PositioningPortalProps<Strategy> {
    children: React.ReactNode | ((params: RenderProps) => React.ReactNode);
}
declare type PositioningPortalWithState<Strategy = Position> = React.StatelessComponent<Props<Strategy>>;
declare const PositioningPortalWithState: PositioningPortalWithState;
export default PositioningPortalWithState;
