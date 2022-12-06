import * as React from 'react';

import PositioningPortal, {
  Props as PositioningPortalProps,
} from './PositioningPortal';

export interface RenderProps {
  close: () => void;
  open: () => void;
  isOpen: boolean;
}

export interface Props<Strategy>
  extends Omit<PositioningPortalProps<Strategy>, 'children' | 'isOpen'> {
  children: React.ReactNode | ((params: RenderProps) => React.ReactNode);
}

function renderProps<Strategy>(
  element: Props<Strategy>['children'],
  props: RenderProps
): React.ReactNode {
  return typeof element === 'function' ? element(props) : element;
}

type PositioningPortalWithState<Strategy> = React.FunctionComponent<
  Props<Strategy>
>;

function PositioningPortalWithState<Strategy>(props: Props<Strategy>) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { children, ...restProps } = props;

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <PositioningPortal {...restProps} isOpen={isOpen} onShouldClose={close}>
      {renderProps(children, {
        open,
        close,
        isOpen,
      })}
    </PositioningPortal>
  );
}

export default PositioningPortalWithState;
