import { FunctionComponent } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { QueueIconButton } from '../../components/button/Button';
import { queueObjectsByQueueIndexSelector } from '../../store/document';
import { documentSettingsState } from '../../store/settings';
import styles from './Subtoolbar.module.scss';

export interface QueueSubtoolbarProps {
  onQueueIndexChange?: (from: number, current: number) => void;
  onNextQueueClick?: () => void;
  onPreviousQueueClick?: () => void;
}

export const QueueSubtoolbar: FunctionComponent<QueueSubtoolbarProps> = ({
  onQueueIndexChange,
  onNextQueueClick,
  onPreviousQueueClick,
}) => {
  const [settings, setSettings] = useRecoilState(documentSettingsState);
  const start = Math.max(settings.queueIndex - 2, 0);
  const queues = useRecoilValue(
    queueObjectsByQueueIndexSelector({
      start: start,
      end: start + 4,
    })
  );

  const increaseScale = (): void => {
    setSettings({
      ...settings,
      scale: settings.scale + 0.05,
    });
  };

  const decreaseScale = (): void => {
    setSettings({
      ...settings,
      scale: Math.max(settings.scale - 0.05, 0.1),
    });
  };

  const startPresentationModel = (): void => {
    setSettings({
      ...settings,
      presentationMode: true,
    });
  };

  const setCurrentQueueIndex = (index: number): void => {
    const from = settings.queueIndex;
    const to = index;
    setSettings({
      ...settings,
      queueStart: -1,
      queueIndex: to,
      queuePosition: 'pause',
    });
    onQueueIndexChange?.(from, to);
  };

  const goToPreviousQueue = (): void => {
    const from = settings.queueIndex;
    const to = Math.max(settings.queueIndex - 1, 0);
    setSettings({
      ...settings,
      queueStart: performance.now(),
      queueIndex: to,
      queuePosition: settings.queueIndex - 1 >= 0 ? 'backward' : 'pause',
    });
    onQueueIndexChange?.(from, to);
    onPreviousQueueClick?.();
  };

  const goToNextQueue = (): void => {
    const from = settings.queueIndex;
    const to = settings.queueIndex + 1;
    setSettings({
      ...settings,
      queueStart: performance.now(),
      queueIndex: to,
      queuePosition: 'forward',
    });
    onQueueIndexChange?.(from, to);
    onNextQueueClick?.();
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <QueueIconButton className={styles.btn}>
          <i className="ri-arrow-go-back-line" />
        </QueueIconButton>
        <QueueIconButton className={styles.btn}>
          <i className="ri-arrow-go-forward-line" />
        </QueueIconButton>
        <QueueIconButton className={styles.btn}>
          <i className="ri-file-copy-line" />
        </QueueIconButton>
        <QueueIconButton className={styles.btn}>
          <i className="ri-clipboard-line" />
        </QueueIconButton>
        <QueueIconButton className={styles.btn} onClick={startPresentationModel}>
          <i className="ri-slideshow-3-line"></i>
        </QueueIconButton>
      </div>
      <div className={styles.center}>
        <QueueIconButton className={styles.btn} onClick={goToPreviousQueue}>
          <i className="ri-arrow-left-line" />
        </QueueIconButton>
        {queues.map((queue, index) => (
          <QueueIconButton
            key={index}
            className={styles.btn}
            style={{
              color: queue.index === settings.queueIndex ? 'red' : 'black',
            }}
            onClick={(): void => setCurrentQueueIndex(queue.index)}
          >
            {queue.index + 1}
          </QueueIconButton>
        ))}
        <QueueIconButton className={styles.btn} onClick={goToNextQueue}>
          <i className="ri-arrow-right-line" />
        </QueueIconButton>
      </div>
      <div className={styles.right}>
        <QueueIconButton className={styles.btn} onClick={decreaseScale}>
          <i className="ri-subtract-line" />
        </QueueIconButton>
        <QueueIconButton className={styles.btn} onClick={increaseScale}>
          <i className="ri-add-line" />
        </QueueIconButton>
      </div>
    </div>
  );
};
