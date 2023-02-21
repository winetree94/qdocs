import { createContext, FunctionComponent, ReactNode, useEffect } from 'react';
import { QueueEditor } from '../../components/editor/Editor';
import { LeftPanel } from '../left-panel/LeftPanel';
import { QueueSubtoolbar } from '../subtoolbar/Subtoolbar';
import { QueueToolbar } from '../toolbar/Toolbar';
import styles from './RootLayout.module.scss';
import clsx from 'clsx';
import { BottomPanel } from 'app/bottom-panel/BottomPanel';
import { Welcome } from 'app/welcome-panel/Welcome';
import { selectDocument } from 'store/document/selectors';
import { selectSettings } from 'store/settings/selectors';
import { setSettings } from 'store/settings/actions';
import { useAppDispatch, useAppSelector } from 'store/hooks';

export const RootContext = createContext({});

export const RootLayout: FunctionComponent<{ children?: ReactNode }> = (
  props
) => {
  const queueDocument = useAppSelector(selectDocument);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && settings.presentationMode) {
        dispatch(setSettings({
          ...settings,
          presentationMode: false
        }));
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
  }, [settings, dispatch]);

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
              {!settings.presentationMode && <BottomPanel />}
            </div>
          </div>
        )}

        {!queueDocument && (
          <div className={clsx(styles.Content)}>
            <Welcome></Welcome>
          </div>
        )}
      </div>
    </RootContext.Provider>
  );
};
