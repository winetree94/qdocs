import { nanoid } from '@reduxjs/toolkit';
import { useGlobalKeydown } from 'cdk/hooks/useGlobalKeydown';
import { isQueueObjectClipboardModel } from 'model/clipboard/base';
import { QUEUE_CLIPBOARD_UNIQUE_ID } from 'model/clipboard/constants';
import { QueueEffectType } from 'model/effect';
import { QueueObjectType } from 'model/object';
import { store } from 'store';
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
            const effectsByObjectId = EffectSelectors.effectsByObjectId(
              store.getState(),
            );
            const models = SettingSelectors.selectedObjects(
              store.getState(),
            ).map((object) => {
              return {
                object: object,
                effects: effectsByObjectId[object.id],
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
        callback: async () => {
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
        callback: () => {
          if (selectionMode === 'detail') return;
          dispatch(
            SettingsActions.setSelection({
              selectionMode: 'normal',
              ids: SettingSelectors.pageObjectIds(store.getState()),
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
        callback: () => {
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
        callback: () => {
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
        callback: () => {
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
