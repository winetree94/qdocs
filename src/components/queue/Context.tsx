import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useQueueDocument } from 'cdk/hooks/useQueueDocument';
import { useSettings } from 'cdk/hooks/useSettings';
import { QueueContextMenu } from 'components/context-menu/Context';
import styles from './Context.module.scss';

export const ContextContent: React.FC = () => {
  const { settings } = useSettings();
  const { queueDocument, ...setQueueDocument } = useQueueDocument();

  return (
    <QueueContextMenu.Content
      onMouseDown={(e): void => e.stopPropagation()}>
      <QueueContextMenu.Item
        onClick={(): void => setQueueDocument.removeObjectOnQueue(settings.selectedObjectUUIDs)}
      >
        현재 큐에서 삭제{' '}
        <div className={styles.RightSlot}>Backspace</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item
        onClick={(): void => setQueueDocument.removeObject(settings.selectedObjectUUIDs)}
      >
        오브젝트 삭제{' '}
        <div className={styles.RightSlot}>
          ⌘+Backspace
        </div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Separator />
      <QueueContextMenu.Item>
        잘라내기{' '}
        <div className={styles.RightSlot}>⌘+T</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item>
        복사 <div className={styles.RightSlot}>⌘+C</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Separator />
      <QueueContextMenu.Item
        onClick={(): void =>
          setQueueDocument.changeObjectIndex(
            settings.selectedObjectUUIDs,
            'start'
          )
        }>
        맨 앞으로 가져오기
      </QueueContextMenu.Item>
      <QueueContextMenu.Item
        onClick={(): void =>
          setQueueDocument.changeObjectIndex(
            settings.selectedObjectUUIDs,
            'end'
          )
        }>
        맨 뒤로 보내기
      </QueueContextMenu.Item>
      <QueueContextMenu.Item
        onClick={(): void =>
          setQueueDocument.changeObjectIndex(
            settings.selectedObjectUUIDs,
            'forward'
          )
        }>
        앞으로 가져오기
      </QueueContextMenu.Item>
      <QueueContextMenu.Item
        onClick={(): void =>
          setQueueDocument.changeObjectIndex(
            settings.selectedObjectUUIDs,
            'backward'
          )
        }>
        뒤로 보내기
      </QueueContextMenu.Item>
      <QueueContextMenu.Separator />
      <QueueContextMenu.Item>그룹</QueueContextMenu.Item>
      <QueueContextMenu.Item>
        그룹 해제
      </QueueContextMenu.Item>
      <QueueContextMenu.Separator />
      <QueueContextMenu.Sub>
        <QueueContextMenu.SubTrigger>
          더보기
          <div className={styles.RightSlot}>
            <ChevronRightIcon />
          </div>
        </QueueContextMenu.SubTrigger>
        <QueueContextMenu.Portal>
          <QueueContextMenu.SubContent
            sideOffset={2}
            alignOffset={-5}>
            <QueueContextMenu.Item>
              Save Page As…{' '}
              <div className={styles.RightSlot}>⌘+S</div>
            </QueueContextMenu.Item>
            <QueueContextMenu.Item>
              Create Shortcut…
            </QueueContextMenu.Item>
            <QueueContextMenu.Item>
              Name Window…
            </QueueContextMenu.Item>
            <QueueContextMenu.Separator />
            <QueueContextMenu.Item>
              Developer Tools
            </QueueContextMenu.Item>
          </QueueContextMenu.SubContent>
        </QueueContextMenu.Portal>
      </QueueContextMenu.Sub>
    </QueueContextMenu.Content>
  );
};