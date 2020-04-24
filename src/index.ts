import PositioningPortalImport, {
  Props as PositioningPortalPropsImport,
  PortalContentRenderProps as PortalContentRenderPropsImport
} from './components/PositioningPortal';

import PositioningPortalWithStateImport, {
  Props as PositioningPortalWithStatePropsImport,
  RenderProps as RenderPropsImport
} from './components/PositioningPortalWithState';

export const PositioningPortal = PositioningPortalImport;
export type PositioningPortalProps<Strategy> = PositioningPortalPropsImport<
  Strategy
>;
export type PortalContentRenderProps<Strategy> = PortalContentRenderPropsImport<
  Strategy
>;

export const PositioningPortalWithState = PositioningPortalWithStateImport;
export type PositioningPortalWithStateProps<
  Strategy
> = PositioningPortalWithStatePropsImport<Strategy>;
export type RenderProps = RenderPropsImport;
