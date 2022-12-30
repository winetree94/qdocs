import styled from '@emotion/styled';
import { FunctionComponent, ReactNode } from 'react';
import { Toolbar, ToolbarItem } from '../toolbar/Toolbar';
import { OverlayTest } from './OverlayTest';

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const ToolbarLayout = styled.div`
  display: flex;
  height: 60px;
`;

const SubtoolbarLayout = styled.div`
  display: flex;
  height: 40px;
`;

const ContentLayout = styled.div`
  flex: 1 1 auto;
`;

export const RootLayout: FunctionComponent<{ children?: ReactNode }> = (
  props
) => {
  return (
    <MainLayout className="queue-root-layout">
      <ToolbarLayout className="queue-toolbar-layout">
        <Toolbar>
          <ToolbarItem>
            <i className="ri-home-line"></i>File
          </ToolbarItem>
          <ToolbarItem>Edit</ToolbarItem>
          <ToolbarItem>View</ToolbarItem>
        </Toolbar>
      </ToolbarLayout>
      <SubtoolbarLayout className="queue-subtoolbar-layout"></SubtoolbarLayout>
      <ContentLayout className="queue-content-layout">
        <OverlayTest></OverlayTest>
      </ContentLayout>
    </MainLayout>
  );
};
