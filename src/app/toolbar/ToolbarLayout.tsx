import styled from '@emotion/styled';
import { FunctionComponent } from 'react';
import { Toolbar, ToolbarItem } from '../../components/toolbar/Toolbar';

const ToolbarContainer = styled.div`
  display: flex;
`;

export const ToolbarLayout: FunctionComponent = () => {
  return (
    <ToolbarContainer>
      <div>the queue</div>
      <div>
        <div>document title</div>
        <div>
          <Toolbar>
            <ToolbarItem>
              <i className="ri-home-line"></i>File
            </ToolbarItem>
            <ToolbarItem>Edit</ToolbarItem>
            <ToolbarItem>View</ToolbarItem>
          </Toolbar>
        </div>
      </div>
    </ToolbarContainer>
  );
};
