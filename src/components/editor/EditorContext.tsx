import { ContextMenuContentProps } from '@radix-ui/react-context-menu';
import { nanoid } from '@reduxjs/toolkit';
import { deviceMetaKey } from 'cdk/device/meta';
import { QueueContextMenu } from 'components/context-menu/Context';
import { isQueueObjectClipboardModel } from 'model/clipboard/base';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { EffectActions, NormalizedQueueEffect } from 'store/effect';
import { HistoryActions } from 'store/history';
import { HistorySelectors } from 'store/history/selectors';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { NormalizedQueueObjectType, ObjectActions } from 'store/object';
import { SettingsActions, SettingSelectors } from 'store/settings';
import styles from './EditorContext.module.scss';

export const EditorContext = forwardRef<HTMLDivElement, ContextMenuContentProps & React.RefAttributes<HTMLDivElement>>(
  (_, ref) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const settings = useAppSelector(SettingSelectors.settings);
    const history = useAppSelector(HistorySelectors.all);

    const paste = async () => {
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
    };

    return (
      <QueueContextMenu.Content ref={ref}>
        <QueueContextMenu.Item disabled={!history.previous.length} onClick={() => dispatch(HistoryActions.Undo())}>
          {t('global.undo')} <div className={styles.RightSlot}>{deviceMetaKey}+Z</div>
        </QueueContextMenu.Item>
        <QueueContextMenu.Item disabled={!history.future.length} onClick={() => dispatch(HistoryActions.Redo())}>
          {t('global.redo')} <div className={styles.RightSlot}>{deviceMetaKey}+Shift+Z</div>
        </QueueContextMenu.Item>
        <QueueContextMenu.Separator />
        <QueueContextMenu.Item onClick={() => paste()}>
          {t('global.paste')} <div className={styles.RightSlot}>{deviceMetaKey}+V</div>
        </QueueContextMenu.Item>
      </QueueContextMenu.Content>
    );
  },
);
