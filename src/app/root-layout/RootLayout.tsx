import { css } from '@emotion/css';
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { documentSettingsState } from '../../store/settings';
import { QueueEditor, QueueEditorRef } from '../../components/editor/Editor';
import { LeftPanel } from '../left-panel/LeftPanel';
import { RightPanel } from '../right-panel/RightPanel';
import { QueueSubtoolbar } from '../subtoolbar/Subtoolbar';
import { QueueToolbar } from '../toolbar/Toolbar';
import { documentState } from '../../store/document';

export const RootContext = createContext({});

export const RootLayout: FunctionComponent<{ children?: ReactNode }> = (
  props
) => {
  const editorRef = useRef<QueueEditorRef>(null);
  const queueDocument = useRecoilValue(documentState);
  const [settings, setSettings] = useRecoilState(documentSettingsState);

  useEffect(() => {
    console.log(editorRef);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && settings.presentationMode) {
        setSettings({ ...settings, presentationMode: false });
      }
    });
  }, [settings, setSettings]);

  return (
    <RootContext.Provider value={{}}>
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
            <QueueToolbar></QueueToolbar>
            <QueueSubtoolbar
              onNextQueueClick={(): void => editorRef.current?.animate()}
              onPreviousQueueClick={(): void => editorRef.current?.animate()}
            ></QueueSubtoolbar>
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
          <QueueEditor
            ref={editorRef}
            queueIndex={settings.queueIndex}
            documentRect={queueDocument.documentRect}
            scale={settings.scale}
            objects={queueDocument.objects}
          ></QueueEditor>
          {!settings.presentationMode ? <RightPanel></RightPanel> : null}
        </div>
      </div>
    </RootContext.Provider>
  );
};
