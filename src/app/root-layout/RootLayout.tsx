import { createContext, FunctionComponent, ReactNode, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { documentSettingsState } from '../../store/settings';
import { QueueEditor } from '../../components/editor/Editor';
import { LeftPanel } from '../left-panel/LeftPanel';
import { QueueSubtoolbar } from '../subtoolbar/Subtoolbar';
import { QueueToolbar } from '../toolbar/Toolbar';
import styles from './RootLayout.module.scss';
import { documentState } from 'store/document';

export const RootContext = createContext({});

export const RootLayout: FunctionComponent<{ children?: ReactNode }> = (
  props
) => {
  const [queueDocument] = useRecoilState(documentState);
  const [settings, setSettings] = useRecoilState(documentSettingsState);

  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && settings.presentationMode) {
        setSettings({ ...settings, presentationMode: false });
      }
    });
  }, [settings, setSettings]);

  return (
    <RootContext.Provider value={{}}>
      <div className={styles.container}>
        {!settings.presentationMode ? (
          <>
            <QueueToolbar />
            {queueDocument && <QueueSubtoolbar />}
          </>
        ) : null}
        {queueDocument && (
          <div className={styles.bottom}>
            {!settings.presentationMode ? <LeftPanel /> : null}
            <QueueEditor />
          </div>
        )}
      </div>
    </RootContext.Provider>
  );
};
