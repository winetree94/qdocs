import { FunctionComponent, ReactNode } from 'react';
import { Overlay } from '../overlay/Overlay';

export interface PopoverProps {
  children?: ReactNode;
}

export const Popover: FunctionComponent<PopoverProps> = (props) => {
  const { children } = props;
  return <Overlay id="sdf">{children}</Overlay>;
};
