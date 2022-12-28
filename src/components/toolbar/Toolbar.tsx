import styled from '@emotion/styled';
import { FunctionComponent, ReactNode } from 'react';

export const ToolbarLayout = styled.div`
  display: flex;
  height: 36px;
`;

export const Toolbar: FunctionComponent<{ children: ReactNode }> = (props) => {
  const { children } = props;
  return <ToolbarLayout className="queue-toolbar">{children}</ToolbarLayout>;
};

export const ToolbarButton = styled.button`
  width: 100px;
  border: none;
`;

export const ToolbarItem: FunctionComponent<{ children: ReactNode }> = (
  props
) => {
  const { children } = props;
  return (
    <ToolbarButton className="queue-toolbar-item">{children}</ToolbarButton>
  );
};
