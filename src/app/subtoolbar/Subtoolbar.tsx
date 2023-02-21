import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import clsx from 'clsx';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { QueueSeparator } from 'components/separator/Separator';
import { QueueToggle } from 'components/toggle/Toggle';
import { useDispatch, useSelector } from 'react-redux';
import { selectObjectEffectsByQueue, selectPages } from 'store/document/selectors';
import { setSettings } from 'store/settings/actions';
import { selectQueueRange, selectSettings } from 'store/settings/selectors';
import { QueueIconButton } from '../../components/button/Button';
import styles from './Subtoolbar.module.scss';

export type QueueSubtoolbarProps = {
  fitToScreen?: () => void;
}

export const QueueSubtoolbar: React.FC<QueueSubtoolbarProps> = ({
  fitToScreen
}) => {
  const settings = useSelector(selectSettings);
  const dispatch = useDispatch();
  const pages = useSelector(selectPages);
  const effectsByQueues = useSelector(selectObjectEffectsByQueue);
  const currentEffectsByQueues = effectsByQueues[settings.queuePage];
  const ranges = useSelector(selectQueueRange);

  const setQueueIndex = (
    index: number,
    play?: boolean,
  ): void => {
    const target = Math.max(0, index);
    const sameIndex = settings.queueIndex === target;
    dispatch(setSettings({
      ...settings,
      queueIndex: target,
      queuePosition: sameIndex ? 'pause' : settings.queueIndex < target ? 'forward' : 'backward',
      queueStart: play ? performance.now() : -1,
      selectedObjectUUIDs: [],
      selectionMode: 'normal',
    }));
  };

  const increaseScale = (): void => {
    dispatch(
      setSettings({ ...settings, scale: settings.scale + 0.05 })
    );
  };
  const decreaseScale = (): void => {
    dispatch(
      setSettings({ ...settings, scale: Math.max(settings.scale - 0.05, 0.25) })
    );
  };
  const setCurrentQueueIndex = (index: number): void => setQueueIndex(index, false);
  const goToPreviousQueue = (): void => setQueueIndex(settings.queueIndex - 1, true);
  const goToNextQueue = (): void => setQueueIndex(settings.queueIndex + 1, true);

  const rewind = (): void => {
    const targetPageQueueIndex = settings.queueIndex - 1;
    if (targetPageQueueIndex < 0 && settings.queuePage > 0) {
      setSettings({
        ...settings,
        queuePage: settings.queuePage - 1,
        queueIndex: effectsByQueues[settings.queuePage - 1].length - 1,
        queuePosition: 'pause',
        queueStart: -1,
        selectedObjectUUIDs: [],
        selectionMode: 'normal',
      });
      return;
    }
    if (targetPageQueueIndex < 0) {
      return;
    }
    setQueueIndex(settings.queueIndex - 1, true);
  };

  const play = (): void => {
    const targetPageQueueIndex = settings.queueIndex + 1;
    if (
      targetPageQueueIndex >= effectsByQueues[settings.queuePage].length &&
      settings.queuePage < pages.length - 1
    ) {
      setSettings({
        ...settings,
        queuePage: settings.queuePage + 1,
        queueIndex: 0,
        queuePosition: 'pause',
        queueStart: -1,
        selectedObjectUUIDs: [],
        selectionMode: 'normal',
      });
      return;
    }
    if (targetPageQueueIndex > effectsByQueues[settings.queuePage].length - 1) {
      return;
    }
    setQueueIndex(settings.queueIndex + 1, true);
  };

  const fitScale = (): void => fitToScreen?.();
  const startPresentationModel = (): void => {
    setSettings({
      ...settings,
      presentationMode: true,
      selectedObjectUUIDs: [],
      selectionMode: 'normal',
    });
    document.documentElement.requestFullscreen();
  };

  return (
    <QueueScrollArea.Root className={styles.Container}>
      <QueueScrollArea.Viewport>
        <div className={styles.ItemRoot}>
          <div className={styles.ItemGroup}>
            <QueueIconButton onClick={console.log}>
              <SvgRemixIcon
                width={15}
                height={15}
                icon={'ri-arrow-go-back-line'}
              />
            </QueueIconButton>

            <QueueIconButton onClick={console.log}>
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
            <QueueIconButton onClick={rewind}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-left-s-fill'} />
            </QueueIconButton>
            <QueueIconButton onClick={goToPreviousQueue}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-left-line'} />
            </QueueIconButton>
            {ranges.map((queue) => (
              <QueueIconButton
                className={clsx(
                  styles.QueueIndicator,
                  currentEffectsByQueues[queue] ? styles.HasEffect : '',
                  queue === settings.queueIndex ? styles.Current : ''
                )}
                key={queue}
                onClick={(): void => setCurrentQueueIndex(queue)}>
                {queue + 1}
              </QueueIconButton>
            ))}
            <QueueIconButton onClick={goToNextQueue}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-right-line'} />
            </QueueIconButton>
            <QueueIconButton onClick={play}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-right-s-fill'} />
            </QueueIconButton>
          </div>
          <div className={styles.ItemGroup}>
            <QueueSeparator.Root
              orientation="vertical"
              decorative
              className={styles.Separator}
            />

            <QueueIconButton onClick={fitScale}>
              <SvgRemixIcon width={15} height={15} icon={'ri-fullscreen-fill'} />
            </QueueIconButton>
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
