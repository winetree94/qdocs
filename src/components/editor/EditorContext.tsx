import { ContextMenuContentProps } from '@radix-ui/react-context-menu';
import { QueueContextMenu } from 'components/context-menu/Context';
import { forwardRef } from 'react';
import { HistoryActions } from 'store/history';
import { HistorySelectors } from 'store/history/selectors';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import styles from './EditorContext.module.scss';

export const EditorContext: React.ForwardRefExoticComponent<
  ContextMenuContentProps & React.RefAttributes<HTMLDivElement>
> = forwardRef((_, ref) => {
  const dispatch = useAppDispatch();
  const history = useAppSelector(HistorySelectors.all);
  return (
    <QueueContextMenu.Content ref={ref}>
      <QueueContextMenu.Item disabled={!history.previous.length} onClick={() => dispatch(HistoryActions.Undo())}>
        실행 취소 <div className={styles.RightSlot}>⌘+Z</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item disabled={!history.future.length} onClick={() => dispatch(HistoryActions.Redo())}>
        다시 실행 <div className={styles.RightSlot}>⌘+Shift+Z</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Separator />
      <QueueContextMenu.Item disabled>
        붙여넣기 <div className={styles.RightSlot}>⌘+V</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item disabled>
        이 위치로 붙여넣기 <div className={styles.RightSlot}>⌘+V</div>
      </QueueContextMenu.Item>
    </QueueContextMenu.Content>
  );
});
