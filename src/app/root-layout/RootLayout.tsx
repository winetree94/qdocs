import { useEffect } from 'react';
import { QueueEditor } from '../../components/editor/Editor';
import styles from './RootLayout.module.scss';
import clsx from 'clsx';
import { Welcome } from 'app/welcome-panel/Welcome';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { DocumentSelectors } from 'store/document/selectors';
import { SettingSelectors } from 'store/settings/selectors';
import { SettingsActions } from '../../store/settings';
import { useGlobalKeydown } from 'cdk/hooks/useGlobalKeydown';
import { EffectActions, EffectSelectors } from 'store/effect';
import { isQueueObjectClipboardModel } from 'model/clipboard/base';
import { ObjectActions } from 'store/object';
import { nanoid } from '@reduxjs/toolkit';
import { HistoryActions } from 'store/history';
import { HistorySelectors } from 'store/history/selectors';
import { QUEUE_CLIPBOARD_UNIQUE_ID } from 'model/clipboard/constants';
import { PanelResizer } from 'cdk/panel-resizer/PanelResizer';
import { RightPanel } from 'app/right-panel/RightPanel';
import { PagePanel } from 'app/page-panel/PagePanel';
import { QueueEffectType } from 'model/effect';
import { QueueObjectType } from 'model/object';
import QueueSubHeader from 'app/sub-header/SubHeader';
import { QueueHeader } from 'app/header/Header';
import { BottomPanel } from 'app/bottom-panel/BottomPanel';

export const RootLayout = () => {
  const dispatch = useAppDispatch();
  const { previous, future } = useAppSelector(HistorySelectors.all);
  const docs = useAppSelector(DocumentSelectors.document);
  const {
    selectionMode,
    presentationMode,
    pageId,
    selectedObjectIds,
    autoPlay,
  } = useAppSelector(SettingSelectors.settings);

  // object 또는 Effect가 계속 dispatch 되기 때문에 매번 다시 셀렉트 하는 것으로 보임...(렌더링 개선 포인트)
  const pageObjects = useAppSelector(SettingSelectors.pageObjects);
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const effects = useAppSelector(EffectSelectors.groupByObjectId);

  /**
   * @description
   * 키보드 단축키 바인딩
   */
  useGlobalKeydown({
    keys: [
      {
        keys: ['Escape'],
        callback: () => {
          if (presentationMode) {
            dispatch(
              SettingsActions.updateSettings({
                changes: {
                  presentationMode: false,
                },
              }),
            );
          }
        },
      },
      {
        keys: ['c'],
        meta: true,
        callback: async (e) => {
          if (selectionMode === 'detail') return;
          e.preventDefault();
          try {
            const models = selectedObjects.map((object) => {
              return {
                object: object,
                effects: effects[object.id],
              };
            });
            await navigator.clipboard.writeText(
              JSON.stringify({
                identity: QUEUE_CLIPBOARD_UNIQUE_ID,
                type: 'objects',
                data: models,
              }),
            );
          } catch (error) {
            console.warn(error);
          }
        },
      },
      {
        keys: ['v'],
        meta: true,
        callback: async (e) => {
          if (selectionMode === 'detail') return;
          try {
            const raw = await navigator.clipboard.readText();
            const clipboardData = JSON.parse(raw) as ClipboardItemData;
            if (isQueueObjectClipboardModel(clipboardData)) {
              const pendingObjects: QueueObjectType[] = [];
              const pendingEffects: QueueEffectType[] = [];
              clipboardData.data.forEach((data) => {
                const objectId = nanoid();
                pendingObjects.push({
                  ...data.object,
                  id: objectId,
                  pageId: pageId,
                  rect: {
                    ...data.object.rect,
                    x: data.object.rect.x + 10,
                    y: data.object.rect.y + 10,
                  },
                });
                pendingEffects.push(
                  ...data.effects.map((effect) => {
                    return {
                      ...effect,
                      id: nanoid(),
                      objectId: objectId,
                    };
                  }),
                );
              });

              if (pendingObjects.length === 0) {
                return;
              }
              dispatch(HistoryActions.Capture());
              dispatch(EffectActions.upsertEffects(pendingEffects));
              dispatch(
                ObjectActions.addMany({
                  queueIndex: undefined,
                  objects: pendingObjects,
                }),
              );
              dispatch(
                SettingsActions.setSelection({
                  selectionMode: 'normal',
                  ids: pendingObjects.map((object) => object.id),
                }),
              );
            }
          } catch (error) {
            console.warn('not supported clipboard data');
          }
        },
      },
      {
        keys: ['a'],
        meta: true,
        callback: (e) => {
          if (selectionMode === 'detail') return;
          dispatch(
            SettingsActions.setSelection({
              selectionMode: 'normal',
              ids: pageObjects.map((object) => object.id),
            }),
          );
        },
      },
      {
        keys: ['z'],
        meta: true,
        callback: (e) => {
          if (selectionMode === 'detail') return;
          if (previous.length === 0) return;
          e.preventDefault();
          dispatch(HistoryActions.Undo());
        },
      },
      {
        keys: ['z', 'Z'],
        meta: true,
        shift: true,
        callback: (e) => {
          if (selectionMode === 'detail') return;
          if (future.length === 0) return;
          e.preventDefault();
          dispatch(HistoryActions.Redo());
        },
      },
      {
        keys: ['Escape'],
        callback: (e) => {
          dispatch(
            SettingsActions.setSelection({
              selectionMode: 'normal',
              ids: [],
            }),
          );
        },
      },
      {
        keys: ['Delete', 'Backspace'],
        meta: false,
        callback: (e) => {
          if (selectedObjectIds.length === 0 || selectionMode !== 'normal') {
            return;
          }
          dispatch(HistoryActions.Capture());
          dispatch(
            EffectActions.removeObjectOnQueue({
              ids: selectedObjectIds,
            }),
          );
        },
      },
      {
        keys: ['Delete', 'Backspace'],
        meta: true,
        callback: (e) => {
          if (selectedObjectIds.length === 0 || selectionMode !== 'normal') {
            return;
          }
          dispatch(HistoryActions.Capture());
          dispatch(ObjectActions.removeMany(selectedObjectIds));
        },
      },
    ],
  });

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

          <div className="tw-flex tw-flex-col tw-h-full tw-pt-2.5 tw-bg-[var(--gray-3)]">
            <PanelResizer.Panel
              className="tw-h-full"
              width={240}
              minWidth={200}>
              <PanelResizer.Pane panePosition="left" />
              <RightPanel className="tw-h-full" />
            </PanelResizer.Panel>
          </div>
        </div>
      </div>
    </>
  );
};
