import { ChevronRightIcon } from '@radix-ui/react-icons';
import { ContextMenuContentProps } from '@radix-ui/react-context-menu';
import { QueueContextMenu } from 'components/context-menu/Context';
import { forwardRef } from 'react';
import styles from './Context.module.scss';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { objectsSlice } from 'store/object/reducer';

export const QueueObjectContextContent: React.ForwardRefExoticComponent<
  ContextMenuContentProps & React.RefAttributes<HTMLDivElement>
> = forwardRef((_, ref) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);

  const changeObjectIndex = (fromUUIDs: string[], to: 'start' | 'end' | 'forward' | 'backward'): void => {
    // todo sorting 은 완전히 다시 짜야함
  };

  /**
   * @description
   * 현재 큐에서 오브젝트를 제거, 생성된 큐에서 제거를 시도한 경우 영구히 제거한다.
   */
  const onRemoveObject = (): void => {
    // const pendingCompleteRemoveUUIDs: string[] = [];
    // const updateModels = settings.selectedObjectUUIDs.reduce<{
    //   [key: string]: ObjectQueueEffects;
    // }>((result, uuid) => {
    //   if (effects[uuid].create) {
    //     pendingCompleteRemoveUUIDs.push(uuid);
    //     return result;
    //   }
    //   result[uuid] = {
    //     ...effects[uuid],
    //     remove: {
    //       type: 'remove',
    //       duration: 0,
    //       timing: 'linear',
    //       ...effects[uuid]?.remove,
    //     },
    //   };
    //   return result;
    // }, {});
    // if (Object.values(updateModels).length > 0) {
    //   // todo
    // }
    // if (pendingCompleteRemoveUUIDs.length > 0) {
    //   onCompletelyRemoveClick(pendingCompleteRemoveUUIDs);
    // }
  };

  /**
   * @description
   * 오브젝트를 영구히 제거
   */
  const onCompletelyRemoveClick = (uuids: string[]): void => {
    dispatch(objectsSlice.actions.removeMany(uuids));
  };

  return (
    <QueueContextMenu.Content onMouseDown={(e): void => e.stopPropagation()} ref={ref}>
      <QueueContextMenu.Item onClick={(): void => onRemoveObject()}>
        현재 큐에서 삭제 <div className={styles.RightSlot}>Backspace</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item onClick={(): void => onCompletelyRemoveClick(settings.selectedObjectUUIDs)}>
        오브젝트 삭제 <div className={styles.RightSlot}>⌘+Backspace</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Separator />
      <QueueContextMenu.Item>
        잘라내기 <div className={styles.RightSlot}>⌘+T</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item>
        복사 <div className={styles.RightSlot}>⌘+C</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Separator />
      <QueueContextMenu.Item onClick={(): void => changeObjectIndex(settings.selectedObjectUUIDs, 'start')}>
        맨 앞으로 가져오기
      </QueueContextMenu.Item>
      <QueueContextMenu.Item onClick={(): void => changeObjectIndex(settings.selectedObjectUUIDs, 'end')}>
        맨 뒤로 보내기
      </QueueContextMenu.Item>
      <QueueContextMenu.Item onClick={(): void => changeObjectIndex(settings.selectedObjectUUIDs, 'forward')}>
        앞으로 가져오기
      </QueueContextMenu.Item>
      <QueueContextMenu.Item onClick={(): void => changeObjectIndex(settings.selectedObjectUUIDs, 'backward')}>
        뒤로 보내기
      </QueueContextMenu.Item>
      <QueueContextMenu.Separator />
      <QueueContextMenu.Item>그룹</QueueContextMenu.Item>
      <QueueContextMenu.Item>그룹 해제</QueueContextMenu.Item>
      <QueueContextMenu.Separator />
      <QueueContextMenu.Sub>
        <QueueContextMenu.SubTrigger>
          더보기
          <div className={styles.RightSlot}>
            <ChevronRightIcon />
          </div>
        </QueueContextMenu.SubTrigger>
        <QueueContextMenu.Portal>
          <QueueContextMenu.SubContent sideOffset={2} alignOffset={-5}>
            <QueueContextMenu.Item>
              Save Page As… <div className={styles.RightSlot}>⌘+S</div>
            </QueueContextMenu.Item>
            <QueueContextMenu.Item>Create Shortcut…</QueueContextMenu.Item>
            <QueueContextMenu.Item>Name Window…</QueueContextMenu.Item>
            <QueueContextMenu.Separator />
            <QueueContextMenu.Item>Developer Tools</QueueContextMenu.Item>
          </QueueContextMenu.SubContent>
        </QueueContextMenu.Portal>
      </QueueContextMenu.Sub>
    </QueueContextMenu.Content>
  );
});
