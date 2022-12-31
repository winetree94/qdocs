import { css } from '@emotion/css';
import { FunctionComponent, ReactNode, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { documentSettingsState } from '../../store/settings';
import { Content } from '../content/Content';
import { LeftPanel } from '../left-panel/LeftPanel';
import { RightPanel } from '../right-panel/RightPanel';
import { SubtoolbarLayout } from '../subtoolbar/SubtoolbarLayout';
import { ToolbarLayout } from '../toolbar/ToolbarLayout';

export const RootLayout: FunctionComponent<{ children?: ReactNode }> = (
  props
) => {
  const [settings, setSettings] = useRecoilState(documentSettingsState);

  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && settings.presentationMode) {
        setSettings({ ...settings, presentationMode: false });
      }
    });
  }, [settings, setSettings]);

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100vh;
      `}
    >
      {!settings.presentationMode ? (
        <>
          <ToolbarLayout></ToolbarLayout>
          <SubtoolbarLayout></SubtoolbarLayout>
        </>
      ) : null}
      <div
        className={css`
          display: flex;
          flex: 1;
          min-height: 0;
        `}
      >
        {!settings.presentationMode ? <LeftPanel></LeftPanel> : null}
        <Content></Content>
        {!settings.presentationMode ? <RightPanel></RightPanel> : null}
      </div>
    </div>
  );
};
