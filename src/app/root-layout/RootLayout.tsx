import styled from '@emotion/styled';
import { FunctionComponent, ReactNode } from 'react';
import { ToolbarLayout } from '../toolbar/ToolbarLayout';
import { OverlayTest } from './OverlayTest';

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
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
      <ToolbarLayout></ToolbarLayout>
      <SubtoolbarLayout className="queue-subtoolbar-layout"></SubtoolbarLayout>
      <ContentLayout className="queue-content-layout">
        <OverlayTest></OverlayTest>
      </ContentLayout>
    </MainLayout>
  );
};
