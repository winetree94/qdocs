import { FunctionComponent, ReactNode } from 'react';

export const MenuList: FunctionComponent<{ children: ReactNode }> = (props) => {
  const { children } = props;
  return <div className="queue-menu-list">{children}</div>;
};
