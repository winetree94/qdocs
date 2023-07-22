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
import { useGlobalKeydown } from 'cdk/hooks/useGlobalKeydown';
import { EffectActions, EffectSelectors, NormalizedQueueEffect } from 'store/effect';
import { isQueueObjectClipboardModel } from 'model/clipboard/base';
import { NormalizedQueueObjectType, ObjectActions } from 'store/object';
import { nanoid } from '@reduxjs/toolkit';
import { HistoryActions } from 'store/history';
import { HistorySelectors } from 'store/history/selectors';
import { QUEUE_CLIPBOARD_UNIQUE_ID } from 'model/clipboard/constants';
import { PanelResizer } from 'cdk/panel-resizer/PanelResizer';

export const RootLayout = () => {
  const dispatch = useAppDispatch();
  const history = useAppSelector(HistorySelectors.all);
  const docs = useAppSelector(DocumentSelectors.document);
  const settings = useAppSelector(SettingSelectors.settings);
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
        callback: (e) => {
          if (settings.presentationMode) {
            dispatch(
              SettingsActions.setSettings({
                ...settings,
                presentationMode: false,
              }),
            );
          }
        },
      },
      {
        keys: ['c'],
        meta: true,
        callback: async (e) => {
          if (settings.selectionMode === 'detail') return;
          e.preventDefault();
          try {
            const models = selectedObjects.map((object) => {
              return {
                object: object,
                effects: effects[object.id],
              };
            });
            navigator.clipboard.writeText(
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
          if (settings.selectionMode === 'detail') return;
          try {
            const raw = await navigator.clipboard.readText();
            const clipboardData = JSON.parse(raw);
            if (isQueueObjectClipboardModel(clipboardData)) {
              const pendingObjects: NormalizedQueueObjectType[] = [];
              const pendingEffects: NormalizedQueueEffect[] = [];
              clipboardData.data.forEach((data) => {
                const objectId = nanoid();
                pendingObjects.push({
                  ...data.object,
                  id: objectId,
                  pageId: settings.pageId,
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
          if (settings.selectionMode === 'detail') return;
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
          if (settings.selectionMode === 'detail') return;
          if (history.previous.length === 0) return;
          e.preventDefault();
          dispatch(HistoryActions.Undo());
        },
      },
      {
        keys: ['z', 'Z'],
        meta: true,
        shift: true,
        callback: (e) => {
          if (settings.selectionMode === 'detail') return;
          if (history.future.length === 0) return;
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
          if (settings.selectedObjectIds.length === 0 || settings.selectionMode !== 'normal') {
            return;
          }
          dispatch(HistoryActions.Capture());
          dispatch(
            EffectActions.removeObjectOnQueue({
              ids: settings.selectedObjectIds,
            }),
          );
        },
      },
      {
        keys: ['Delete', 'Backspace'],
        meta: true,
        callback: (e) => {
          if (settings.selectedObjectIds.length === 0 || settings.selectionMode !== 'normal') {
            return;
          }
          dispatch(HistoryActions.Capture());
          dispatch(ObjectActions.removeMany(settings.selectedObjectIds));
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
    if (!settings.autoPlay) return;
    const stop = () => {
      dispatch(SettingsActions.pause());
    };
    document.addEventListener('mousedown', stop);
    return () => {
      document.removeEventListener('mousedown', stop);
    };
  }, [dispatch, settings.autoPlay]);

  /**
   * @description
   * 우클릭 메뉴를 막는다.
   */
  useEffect(() => {
    const onContextmenu = (event: MouseEvent) => event.preventDefault();
    document.addEventListener('contextmenu', onContextmenu);
    return document.removeEventListener('contextmenu', onContextmenu);
  });

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
            // <div className={clsx(styles.Left)}>
            <PanelResizer.Panel className="h-full" width={200} minWidth={30}>
              <PanelResizer.Pane panePosition="right"></PanelResizer.Pane>
              <LeftPanel />
            </PanelResizer.Panel>
            // </div>
          )}
          <div className={clsx(styles.Right)}>
            <QueueEditor />
            {!settings.presentationMode && (
              <PanelResizer.Panel className="w-full" height={200} minHeight={30}>
                <PanelResizer.Pane panePosition="top"></PanelResizer.Pane>
                <BottomPanel />
              </PanelResizer.Panel>
            )}
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
