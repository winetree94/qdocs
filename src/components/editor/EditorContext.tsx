import { QueueContextMenu } from 'components/context-menu/Context';
import styles from './EditorContext.module.scss';

export const EditorContext: React.FC = () => {
  return (
    <QueueContextMenu.Content>
      <QueueContextMenu.Item>
        실행 취소 <div className={styles.RightSlot}>⌘+Z</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item>
        다시 실행 <div className={styles.RightSlot}>⌘+Shift+Z</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Separator />
      <QueueContextMenu.Item>
        붙여넣기 <div className={styles.RightSlot}>⌘+V</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item>
        이 위치로 붙여넣기 <div className={styles.RightSlot}>⌘+V</div>
      </QueueContextMenu.Item>
    </QueueContextMenu.Content>
  );
};