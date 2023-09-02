import { nanoid } from '@reduxjs/toolkit';
import { useGlobalKeydown } from 'cdk/hooks/useGlobalKeydown';
import { isQueueObjectClipboardModel } from 'model/clipboard/base';
import { QUEUE_CLIPBOARD_UNIQUE_ID } from 'model/clipboard/constants';
import { QueueEffectType } from 'model/effect';
import { QueueObjectType } from 'model/object';
import { EffectActions, EffectSelectors } from 'store/effect';
import { HistoryActions } from 'store/history';
import { HistorySelectors } from 'store/history/selectors';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingsActions, SettingSelectors } from 'store/settings';

export const GlobalKeydown = () => {
  const dispatch = useAppDispatch();
  const { previous, future } = useAppSelector(HistorySelectors.all);
  const selectionMode = useAppSelector(SettingSelectors.selectionMode);
  const pageId = useAppSelector(SettingSelectors.pageId);
  const selectedObjectIds = useAppSelector(SettingSelectors.selectedObjectIds);
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
          dispatch(
            SettingsActions.updateSettings({
              changes: {
                presentationMode: false,
              },
            }),
          );
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

  return <></>;
};
