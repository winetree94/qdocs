import { FunctionComponent, ReactNode } from 'react';

export const Toolbar: FunctionComponent<{ children: ReactNode }> = (props) => {
  const { children } = props;
  return <div className="queue-toolbar">{children}</div>;
};

export const ToolbarItem: FunctionComponent<{ children: ReactNode }> = (
  props
) => {
  const { children } = props;
  return <button className="queue-toolbar-item">{children}</button>;
};
