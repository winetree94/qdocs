import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { QueueSeparator } from 'components/separator/Separator';
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
    document.documentElement.requestFullscreen();
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
    <QueueScrollArea.Root className={styles.Container}>
      <QueueScrollArea.Viewport>
        <div className={styles.ItemRoot}>
          <div className={styles.ItemGroup}>
            <QueueIconButton>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-go-back-line'} />
            </QueueIconButton>
            <QueueIconButton>
              <SvgRemixIcon
                width={15}
                height={15}
                icon={'ri-arrow-go-forward-line'}
              />
            </QueueIconButton>
            <QueueIconButton>
              <SvgRemixIcon width={15} height={15} icon={'ri-file-copy-line'} />
            </QueueIconButton>
            <QueueIconButton>
              <SvgRemixIcon width={15} height={15} icon={'ri-clipboard-line'} />
            </QueueIconButton>
            <QueueIconButton onClick={startPresentationModel}>
              <SvgRemixIcon width={15} height={15} icon={'ri-slideshow-3-line'} />
            </QueueIconButton>

            <QueueSeparator.Root
              orientation="vertical"
              decorative
              className={styles.Separator}
            />
          </div>

          <div className={styles.ItemGroup}>
            <QueueIconButton onClick={goToPreviousQueue}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-left-line'} />
            </QueueIconButton>
            {queues.map((queue, index) => (
              <QueueIconButton
                key={index}
                style={{
                  color: queue.index === settings.queueIndex ? 'red' : 'black',
                }}
                onClick={(): void => setCurrentQueueIndex(queue.index)}>
                {queue.index + 1}
              </QueueIconButton>
            ))}
            <QueueIconButton onClick={goToNextQueue}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-right-line'} />
            </QueueIconButton>
          </div>
          <div className={styles.ItemGroup}>
            <QueueSeparator.Root
              orientation="vertical"
              decorative
              className={styles.Separator}
            />

            <QueueIconButton onClick={decreaseScale}>
              <SvgRemixIcon width={15} height={15} icon={'ri-subtract-line'} />
            </QueueIconButton>
            <QueueIconButton onClick={increaseScale}>
              <SvgRemixIcon width={15} height={15} icon={'ri-add-line'} />
            </QueueIconButton>
          </div>
        </div>

      </QueueScrollArea.Viewport>
      <QueueScrollArea.Scrollbar orientation="horizontal" hidden>
        <QueueScrollArea.Thumb />
      </QueueScrollArea.Scrollbar>
    </QueueScrollArea.Root>
  );
};
