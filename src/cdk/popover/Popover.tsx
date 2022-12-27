import { FunctionComponent, ReactNode } from 'react';
import { InternalOverlay } from '../overlay/Overlay';

export interface PopoverProps {
  children?: ReactNode;
}

export const Popover: FunctionComponent<PopoverProps> = (props) => {
  const { children } = props;
  return <InternalOverlay id="sdf">{children}</InternalOverlay>;
};
