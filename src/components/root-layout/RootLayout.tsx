import styled from '@emotion/styled';
import { FunctionComponent, ReactNode, useContext } from 'react';
import { OverlayContext, OverlayContextType } from '../../cdk/overlay/Overlay';
import { GlobalOverlayContext } from '../../cdk/overlay/GlobalOverlay';
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
  const overlayContext = useContext(GlobalOverlayContext);

  const openOverlay = (): void => {
    overlayContext.open(
      <OverlayContext.Consumer>
        {(context: OverlayContextType): ReactNode => (
          <div>
            <p>my overlay</p>
            <button onClick={(): void => context.close()}>close</button>
          </div>
        )}
      </OverlayContext.Consumer>
    );
  };

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
      <SubtoolbarLayout className="queue-subtoolbar-layout">
        subtoolbar
        <button onClick={openOverlay}>click</button>
      </SubtoolbarLayout>
      <ContentLayout className="queue-content-layout">
        <OverlayTest></OverlayTest>
      </ContentLayout>
    </MainLayout>
  );
};
