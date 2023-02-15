import { useSettings } from 'cdk/hooks/useSettings';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { QueueSeparator } from 'components/separator/Separator';
import { QueueToggle } from 'components/toggle/Toggle';
import { useRecoilValue } from 'recoil';
import { queueObjectsByQueueIndexSelector } from 'store/object';
import { QueueIconButton } from '../../components/button/Button';
import styles from './Subtoolbar.module.scss';

export const QueueSubtoolbar: React.FC = () => {
  const { settings, ...setSettings } = useSettings();
  const start = Math.max(settings.queueIndex - 2, 0);
  const queues = useRecoilValue(
    queueObjectsByQueueIndexSelector({
      start: start,
      end: start + 4,
    })
  );

  const increaseScale = (): void => {
    setSettings.setScale(settings.scale + 0.05);
  };

  const decreaseScale = (): void => {
    setSettings.setScale(settings.scale - 0.05);
  };

  const startPresentationModel = (): void => {
    setSettings.setPresentationMode(true);
    document.documentElement.requestFullscreen();
  };

  const setCurrentQueueIndex = (index: number): void => {
    setSettings.setQueueIndex(index, false);
  };

  const goToPreviousQueue = (): void => {
    setSettings.setQueueIndex(settings.queueIndex - 1, true);
  };

  const goToNextQueue = (): void => {
    setSettings.setQueueIndex(settings.queueIndex + 1, true);
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


            <QueueToggle.Root size='small'>
              <SvgRemixIcon width={15} height={15} icon={'ri-movie-line'} />
            </QueueToggle.Root>

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
