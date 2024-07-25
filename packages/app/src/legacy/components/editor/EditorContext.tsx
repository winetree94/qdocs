import { ContextMenuContentProps } from '@radix-ui/react-context-menu';
import { nanoid } from '@reduxjs/toolkit';
import { deviceMetaKey } from '@legacy/cdk/device/meta';
import { isQueueObjectClipboardModel } from '@legacy/model/clipboard/base';
import { QueueEffectType } from '@legacy/model/effect';
import { QueueObjectType } from '@legacy/model/object';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { EffectActions } from '@legacy/store/effect';
import { HistoryActions } from '@legacy/store/history';
import { HistorySelectors } from '@legacy/store/history/selectors';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { ObjectActions } from '@legacy/store/object';
import { SettingsActions, SettingSelectors } from '@legacy/store/settings';
import styles from './EditorContext.module.scss';
import { ContextMenu } from '@radix-ui/themes';

export const EditorContext = forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(function EditorContext(_, ref) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentPageId = useAppSelector(SettingSelectors.pageId);
  const history = useAppSelector(HistorySelectors.all);

  const paste = async () => {
    try {
      const raw = await navigator.clipboard.readText();
      const clipboardData = JSON.parse(raw);
      if (isQueueObjectClipboardModel(clipboardData)) {
        const pendingObjects: QueueObjectType[] = [];
        const pendingEffects: QueueEffectType[] = [];
        clipboardData.data.forEach((data) => {
          const objectId = nanoid();
          pendingObjects.push({
            ...data.object,
            id: objectId,
            pageId: currentPageId,
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
  };

  return (
    <ContextMenu.Content ref={ref}>
      <ContextMenu.Item
        disabled={!history.previous.length}
        onClick={() => dispatch(HistoryActions.Undo())}>
        {t('global.undo')}{' '}
        <div className={styles.RightSlot}>{deviceMetaKey}+Z</div>
      </ContextMenu.Item>
      <ContextMenu.Item
        disabled={!history.future.length}
        onClick={() => dispatch(HistoryActions.Redo())}>
        {t('global.redo')}{' '}
        <div className={styles.RightSlot}>{deviceMetaKey}+Shift+Z</div>
      </ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item onClick={() => paste()}>
        {t('global.paste')}{' '}
        <div className={styles.RightSlot}>{deviceMetaKey}+V</div>
      </ContextMenu.Item>
    </ContextMenu.Content>
  );
});
