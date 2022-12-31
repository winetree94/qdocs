import styled from '@emotion/styled';
import { FunctionComponent, ReactNode, useContext } from 'react';
import { ObjectGroupContext } from './ObjectGroup';

const ObjGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 25%);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

export const ObjectGrid: FunctionComponent<{ children: ReactNode }> = (
  props
) => {
  const context = useContext(ObjectGroupContext);
  const { children } = props;
  if (!context.opened) {
    return null;
  }
  return <ObjGrid className="queue-object-grid">{children}</ObjGrid>;
};
