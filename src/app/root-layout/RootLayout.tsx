import { useEffect } from 'react';
import { QueueEditor } from '../../components/editor/Editor';
import { LeftPanel } from '../left-panel/LeftPanel';
import { QueueSubtoolbar } from '../subtoolbar/Subtoolbar';
import { QueueToolbar } from '../toolbar/Toolbar';
import styles from './RootLayout.module.scss';
import clsx from 'clsx';
import { BottomPanel } from 'app/bottom-panel/BottomPanel';
import { Welcome } from 'app/welcome-panel/Welcome';
import { useAppDispatch } from 'store/hooks';
import { documentSettingsSlice } from 'store/settings/reducer';
import { AppDispatch, RootState } from 'store';
import { connect } from 'react-redux';
import { DocumentSelectors } from 'store/document/selectors';
import { SettingSelectors } from 'store/settings/selectors';
import { QueueDocumentSettings } from '../../store/settings/model';
import { NormalizedQueueDocument } from '../../store/document';

export interface BaseRootLayoutProps {
  docs: NormalizedQueueDocument;
  settings: QueueDocumentSettings;
}

export const BaseRootLayout = ({ docs, settings }: BaseRootLayoutProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && settings.presentationMode) {
        dispatch(
          documentSettingsSlice.actions.setSettings({
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

const mapStateToProps = (state: RootState) => ({
  docs: DocumentSelectors.document(state),
  settings: SettingSelectors.settings(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({});

export const RootLayout = connect(mapStateToProps, mapDispatchToProps)(BaseRootLayout);
