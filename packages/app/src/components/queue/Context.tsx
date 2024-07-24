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
import { store } from 'store';

export const QueueObjectContextContent = forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>((_, ref) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedObjectIds = useAppSelector(SettingSelectors.selectedObjectIds);
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);

  /**
   * @description
   * 현재 큐에서 오브젝트를 제거, 생성된 큐에서 제거를 시도한 경우 영구히 제거한다.
   */
  const onRemoveObject = (): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      EffectActions.removeObjectOnQueue({
        ids: selectedObjectIds,
      }),
    );
  };

  /**
   * @description
   * 오브젝트를 영구히 제거
   */
  const onCompletelyRemoveClick = (): void => {
    dispatch(HistoryActions.Capture());
    dispatch(ObjectActions.removeMany(selectedObjectIds));
  };

  /**
   * @description
   * 오브젝트를 복제
   */
  const duplicate = (): void => {
    dispatch(HistoryActions.Capture());
    dispatch(ObjectActions.duplicate({ ids: selectedObjectIds }));
  };

  /**
   * @description
   * 오브젝트를 클립보드에 복사
   */
  const copyToClipboard = async () => {
    const effects = EffectSelectors.effectsByObjectId(store.getState());
    const models = selectedObjects.map((object) => ({
      object: object,
      effects: effects[object.id],
    }));
    await navigator.clipboard.writeText(
      JSON.stringify({
        identity: QUEUE_CLIPBOARD_UNIQUE_ID,
        type: 'objects',
        data: models,
      }),
    );
  };

  return (
    <QueueContextMenu.Content
      onMouseDown={(e): void => e.stopPropagation()}
      ref={ref}>
      <QueueContextMenu.Item onClick={onRemoveObject}>
        {t('object-context.delete-from-current-queue')}{' '}
        <div className={styles.RightSlot}>Backspace</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item onClick={onCompletelyRemoveClick}>
        {t('object-context.delete-permanently')}{' '}
        <div className={styles.RightSlot}>{deviceMetaKey}+Backspace</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Separator />
      <QueueContextMenu.Item onClick={copyToClipboard}>
        {t('global.copy')}{' '}
        <div className={styles.RightSlot}>{deviceMetaKey}+C</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item onClick={duplicate}>
        {t('global.duplicate')}
      </QueueContextMenu.Item>
      {selectedObjectIds.length === 1 && (
        <>
          <QueueContextMenu.Separator />
          <QueueContextMenu.Item
            onClick={() => {
              dispatch(HistoryActions.Capture());
              dispatch(
                ObjectActions.toFront({
                  id: selectedObjectIds[0],
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
                  id: selectedObjectIds[0],
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
                  id: selectedObjectIds[0],
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
                  id: selectedObjectIds[0],
                }),
              );
            }}>
            {t('object-context.send-backward')}
          </QueueContextMenu.Item>
        </>
      )}
      <QueueContextMenu.Item
        onClick={() => {
          dispatch(HistoryActions.Capture());
          dispatch(
            ObjectActions.Group({
              ids: selectedObjectIds,
            }),
          );
        }}>
        {t('object-context.group')}
      </QueueContextMenu.Item>
      <QueueContextMenu.Item
        onClick={() => {
          dispatch(HistoryActions.Capture());
          dispatch(
            ObjectActions.Ungroup({
              ids: selectedObjectIds,
            }),
          );
        }}>
        {t('object-context.ungroup')}
      </QueueContextMenu.Item>
    </QueueContextMenu.Content>
  );
});
