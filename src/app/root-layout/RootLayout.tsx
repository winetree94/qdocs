import { useEffect } from 'react';
import { QueueEditor } from '../../components/editor/Editor';
import styles from './RootLayout.module.scss';
import clsx from 'clsx';
import { Welcome } from 'app/welcome-panel/Welcome';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { DocumentSelectors } from 'store/document/selectors';
import { SettingSelectors } from 'store/settings/selectors';
import { SettingsActions } from '../../store/settings';
import { PanelResizer } from 'cdk/panel-resizer/PanelResizer';
import { RightPanel } from 'app/right-panel/RightPanel';
import { PagePanel } from 'app/page-panel/PagePanel';
import QueueSubHeader from 'app/sub-header/SubHeader';
import { QueueHeader } from 'app/header/Header';
import { BottomPanel } from 'app/bottom-panel/BottomPanel';
import { GlobalKeydown } from 'app/global-keydown/GlobalKeydown';

export const RootLayout = () => {
  const dispatch = useAppDispatch();
  const docs = useAppSelector(DocumentSelectors.document);
  const presentationMode = useAppSelector(SettingSelectors.presentationMode);
  const autoPlay = useAppSelector(SettingSelectors.autoPlay);

  /**
   * @description
   * 문서가 열려있으면, 페이지 이동하기 전에 경고를 띄워준다.
   */
  useEffect(() => {
    if (!docs) return;
    window.onbeforeunload = (): string => 'beforeUnload';
    return () => {
      window.onbeforeunload = undefined;
    };
  });

  /**
   * @description
   * disallow wheel event
   */
  useEffect(() => {
    document.addEventListener(
      'wheel',
      (event) => {
        if (!event.ctrlKey) {
          return;
        }
        event.preventDefault();
      },
      { passive: false },
    );
  }, []);

  /**
   * @description
   * 애니메이션이 재생 중일 때, 마우스 클릭을 감지하여 애니메이션을 멈춘다.
   */
  useEffect(() => {
    if (!autoPlay) return;
    const stop = () => {
      dispatch(SettingsActions.pause());
    };
    document.addEventListener('mousedown', stop);
    return () => {
      document.removeEventListener('mousedown', stop);
    };
  }, [dispatch, autoPlay]);

  /**
   * @description
   * 우클릭 메뉴를 막는다.
   */
  useEffect(() => {
    const onContextmenu = (event: MouseEvent) => event.preventDefault();
    document.addEventListener('contextmenu', onContextmenu);
    return document.removeEventListener('contextmenu', onContextmenu);
  });

  if (!docs) {
    return (
      <div className={styles.container}>
        <div className={clsx(styles.Content)}>
          <Welcome></Welcome>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        {!presentationMode ? (
          <>
            <QueueHeader />
            <QueueSubHeader />
          </>
        ) : null}

        <div className={clsx(styles.Content)}>
          {!presentationMode && (
            <div className="tw-flex tw-flex-col tw-h-full tw-pt-2.5 tw-bg-[var(--gray-3)]">
              <div className="tw-h-full">
                <PanelResizer.Panel
                  className="tw-h-full"
                  width={200}
                  minWidth={160}>
                  <PanelResizer.Pane panePosition="right"></PanelResizer.Pane>
                  <PagePanel />
                </PanelResizer.Panel>
              </div>
            </div>
          )}
          <div
            className={clsx(
              styles.Right,
              'tw-px-2.5',
              'tw-bg-[var(--gray-3)]',
            )}>
            <QueueEditor />

            {!presentationMode && (
              <div className="tw-border tw-rounded-t-[20px] tw-bg-[var(--gray-1)]">
                <PanelResizer.Panel
                  className="tw-w-full"
                  height={300}
                  minHeight={30}>
                  <PanelResizer.Pane panePosition="top"></PanelResizer.Pane>
                  <BottomPanel />
                </PanelResizer.Panel>
              </div>
            )}
          </div>

          {!presentationMode && (
            <div className="tw-flex tw-flex-col tw-h-full tw-pt-2.5 tw-bg-[var(--gray-3)]">
              <PanelResizer.Panel
                className="tw-h-full"
                width={240}
                minWidth={200}>
                <PanelResizer.Pane panePosition="left" />
                <RightPanel className="tw-h-full" />
              </PanelResizer.Panel>
            </div>
          )}
        </div>
      </div>

      <GlobalKeydown />
    </>
  );
};
