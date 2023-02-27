import { useEffect } from 'react';
import { QueueEditor } from '../../components/editor/Editor';
import { LeftPanel } from '../left-panel/LeftPanel';
import { QueueSubtoolbar } from '../subtoolbar/Subtoolbar';
import { QueueToolbar } from '../toolbar/Toolbar';
import styles from './RootLayout.module.scss';
import clsx from 'clsx';
import { BottomPanel } from 'app/bottom-panel/BottomPanel';
import { Welcome } from 'app/welcome-panel/Welcome';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { DocumentSelectors } from 'store/document/selectors';
import { SettingSelectors } from 'store/settings/selectors';
import { SettingsActions } from '../../store/settings';

export const RootLayout = () => {
  const dispatch = useAppDispatch();
  const docs = useAppSelector(DocumentSelectors.document);
  const settings = useAppSelector(SettingSelectors.settings);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && settings.presentationMode) {
        dispatch(
          SettingsActions.setSettings({
            ...settings,
            presentationMode: false,
          }),
        );
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

  useEffect(() => {
    if (!settings.autoPlay) return;
    const stop = () => {
      dispatch(SettingsActions.pause());
    };
    document.addEventListener('mousedown', stop);
    return () => {
      document.removeEventListener('mousedown', stop);
    };
  }, [dispatch, settings.autoPlay]);

  return (
    <div className={styles.container}>
      {!settings.presentationMode ? (
        <>
          <QueueToolbar />
          {docs && <QueueSubtoolbar />}
        </>
      ) : null}
      {docs && (
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

      {!docs && (
        <div className={clsx(styles.Content)}>
          <Welcome></Welcome>
        </div>
      )}
    </div>
  );
};
