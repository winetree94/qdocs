import { createContext, FunctionComponent, ReactNode, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { documentSettingsState } from '../../store/settings';
import { QueueEditor } from '../../components/editor/Editor';
import { LeftPanel } from '../left-panel/LeftPanel';
import { QueueSubtoolbar } from '../subtoolbar/Subtoolbar';
import { QueueToolbar } from '../toolbar/Toolbar';
import styles from './RootLayout.module.scss';
import { documentState } from 'store/document';
import clsx from 'clsx';
import { BottomPanel } from 'app/bottom-panel/BottomPanel';

export const RootContext = createContext({});

export const RootLayout: FunctionComponent<{ children?: ReactNode }> = (
  props
) => {
  const [queueDocument] = useRecoilState(documentState);
  const [settings, setSettings] = useRecoilState(documentSettingsState);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && settings.presentationMode) {
        setSettings({ ...settings, presentationMode: false });
      }
    };
    const onContextmenu = (event: MouseEvent): void => {
      event.preventDefault();
    };
    const cleaner = (): void => {
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('contextmenu', onContextmenu);
    };
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('contextmenu', onContextmenu);
    window.onbeforeunload = (): string => 'beforeUnload';
    return cleaner;
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
          <div className={clsx(styles.Content)}>
            {!settings.presentationMode && (
              <div className={clsx(styles.Left)}>
                <LeftPanel />
              </div>
            )}
            <div className={clsx(styles.Right)}>
              <QueueEditor />
              {!settings.presentationMode && (
                <BottomPanel />
              )}
            </div>
          </div>
        )}
      </div>
    </RootContext.Provider>
  );
};
