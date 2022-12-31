import { css } from '@emotion/css';
import { FunctionComponent, ReactNode } from 'react';
import { Content } from '../content/Content';
import { LeftPanel } from '../left-panel/LeftPanel';
import { RightPanel } from '../right-panel/RightPanel';
import { SubtoolbarLayout } from '../subtoolbar/SubtoolbarLayout';
import { ToolbarLayout } from '../toolbar/ToolbarLayout';

export const RootLayout: FunctionComponent<{ children?: ReactNode }> = (
  props
) => {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100vh;
      `}
    >
      <ToolbarLayout></ToolbarLayout>
      <SubtoolbarLayout></SubtoolbarLayout>
      <div
        className={css`
          display: flex;
          flex: 1 1 auto;
        `}
      >
        <LeftPanel></LeftPanel>
        <Content></Content>
        <RightPanel></RightPanel>
      </div>
    </div>
  );
};
