import { ContextMenuContentProps } from '@radix-ui/react-context-menu';
import { QueueContextMenu } from 'components/context-menu/Context';
import { forwardRef } from 'react';
import styles from './Context.module.scss';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { ObjectActions } from '../../store/object';
import { HistoryActions } from 'store/history';
import { EffectActions, EffectSelectors } from 'store/effect';
import { QUEUE_CLIPBOARD_UNIQUE_ID } from 'model/clipboard/constants';
import { useTranslation } from 'react-i18next';
import { deviceMetaKey } from 'cdk/device/meta';

export const QueueObjectContextContent = forwardRef<
  HTMLDivElement,
  ContextMenuContentProps & React.RefAttributes<HTMLDivElement>
>((_, ref) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const effects = useAppSelector(EffectSelectors.groupByObjectId);

  /**
   * @description
   * 현재 큐에서 오브젝트를 제거, 생성된 큐에서 제거를 시도한 경우 영구히 제거한다.
   */
  const onRemoveObject = (): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      EffectActions.removeObjectOnQueue({
        ids: settings.selectedObjectIds,
      }),
    );
  };

  /**
   * @description
   * 오브젝트를 영구히 제거
   */
  const onCompletelyRemoveClick = (): void => {
    dispatch(HistoryActions.Capture());
    dispatch(ObjectActions.removeMany(settings.selectedObjectIds));
  };

  /**
   * @description
   * 오브젝트를 복제
   */
  const duplicate = (): void => {
    dispatch(HistoryActions.Capture());
    dispatch(ObjectActions.duplicate({ ids: settings.selectedObjectIds }));
  };

  /**
   * @description
   * 오브젝트를 클립보드에 복사
   */
  const copyToClipboard = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    const models = selectedObjects.map((object) => ({
      object: object,
      effects: effects[object.id],
    }));
    navigator.clipboard.writeText(
      JSON.stringify({
        identity: QUEUE_CLIPBOARD_UNIQUE_ID,
        type: 'objects',
        data: models,
      }),
    );
  };

  return (
    <QueueContextMenu.Content onMouseDown={(e): void => e.stopPropagation()} ref={ref}>
      <QueueContextMenu.Item onClick={onRemoveObject}>
        {t('object-context.delete-from-current-queue')} <div className={styles.RightSlot}>Backspace</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item onClick={onCompletelyRemoveClick}>
        {t('object-context.delete-permanently')} <div className={styles.RightSlot}>{deviceMetaKey}+Backspace</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Separator />
      <QueueContextMenu.Item onClick={copyToClipboard}>
        {t('global.copy')} <div className={styles.RightSlot}>{deviceMetaKey}+C</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item onClick={duplicate}>{t('global.duplicate')}</QueueContextMenu.Item>
      {settings.selectedObjectIds.length === 1 && (
        <>
          <QueueContextMenu.Separator />
          <QueueContextMenu.Item
            onClick={() => {
              dispatch(HistoryActions.Capture());
              dispatch(
                ObjectActions.toFront({
                  id: settings.selectedObjectIds[0],
                }),
              );
            }}>
            {t('object-context.to-front')}
          </QueueContextMenu.Item>
          <QueueContextMenu.Item
            onClick={() => {
              dispatch(HistoryActions.Capture());
              dispatch(
                ObjectActions.toBack({
                  id: settings.selectedObjectIds[0],
                }),
              );
            }}>
            {t('object-context.to-back')}
          </QueueContextMenu.Item>
          <QueueContextMenu.Item
            onClick={() => {
              dispatch(HistoryActions.Capture());
              dispatch(
                ObjectActions.BringForward({
                  id: settings.selectedObjectIds[0],
                }),
              );
            }}>
            {t('object-context.bring-forward')}
          </QueueContextMenu.Item>
          <QueueContextMenu.Item
            onClick={() => {
              dispatch(HistoryActions.Capture());
              dispatch(
                ObjectActions.SendBackward({
                  id: settings.selectedObjectIds[0],
                }),
              );
            }}>
            {t('object-context.send-backward')}
          </QueueContextMenu.Item>
        </>
      )}
    </QueueContextMenu.Content>
  );
});
