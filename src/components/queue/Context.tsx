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

export const QueueObjectContextContent: React.ForwardRefExoticComponent<
  ContextMenuContentProps & React.RefAttributes<HTMLDivElement>
> = forwardRef((_, ref) => {
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
        현재 큐에서 삭제 <div className={styles.RightSlot}>Backspace</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item onClick={onCompletelyRemoveClick}>
        오브젝트 삭제 <div className={styles.RightSlot}>⌘+Backspace</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Separator />
      <QueueContextMenu.Item onClick={copyToClipboard}>
        복사 <div className={styles.RightSlot}>⌘+C</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item onClick={duplicate}>복제</QueueContextMenu.Item>
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
            맨 앞으로 가져오기
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
            맨 뒤로 보내기
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
            앞으로 가져오기
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
            뒤로 보내기
          </QueueContextMenu.Item>
        </>
      )}
    </QueueContextMenu.Content>
  );
});
