import * as React from 'react';
import { Props as PositioningPortalProps } from './PositioningPortal';
export interface RenderProps {
    close: () => void;
    open: () => void;
    isOpen: boolean;
}
export interface Props<Strategy> extends Omit<PositioningPortalProps<Strategy>, 'children' | 'isOpen'> {
    children: React.ReactNode | ((params: RenderProps) => React.ReactNode);
}
type PositioningPortalWithState<Strategy> = React.FunctionComponent<Props<Strategy>>;
declare function PositioningPortalWithState<Strategy>(props: Props<Strategy>): JSX.Element;
export default PositioningPortalWithState;
