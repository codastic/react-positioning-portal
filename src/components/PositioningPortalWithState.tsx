import * as React from 'react';

import PositioningPortal, {
  Props as PositioningPortalProps,
  Position
} from './PositioningPortal';

export interface RenderProps {
  close: () => void;
  open: () => void;
  isOpen: boolean;
}

export interface Props<Strategy = Position>
  extends PositioningPortalProps<Strategy> {
  children: React.ReactNode | ((params: RenderProps) => React.ReactNode);
  onClose?: () => void;
  onOpen?: () => void;
}

const renderProps: <Strategy>(
  element: Props<Strategy>['children'],
  props: RenderProps
) => React.ReactNode = (element, props) =>
  typeof element === 'function' ? element(props) : element;

type PositioningPortalWithState<Strategy = Position> = React.StatelessComponent<
  Props<Strategy>
>;

const PositioningPortalWithState: PositioningPortalWithState = (
  props: Props
) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { onClose, onOpen, children, ...restProps } = props;

  const open = () => {
    setIsOpen(true);
    onOpen();
  };

  const close = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <PositioningPortal {...restProps} isOpen={isOpen} onShouldClose={close}>
      {renderProps(children, {
        open,
        close,
        isOpen
      })}
    </PositioningPortal>
  );
};

export default PositioningPortalWithState;
