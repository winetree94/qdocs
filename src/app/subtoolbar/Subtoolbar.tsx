import { fitScreenSizeEvent } from 'app/events/event';
import { useEventDispatch } from 'cdk/hooks/event-dispatcher';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import clsx from 'clsx';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { QueueSeparator } from 'components/separator/Separator';
import { QueueToggle } from 'components/toggle/Toggle';
import { QueueIconButton } from '../../components/button/Button';
import styles from './Subtoolbar.module.scss';
import { documentSettingsSlice } from 'store/settings/reducer';
import { SettingSelectors } from 'store/settings/selectors';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { EffectSelectors } from 'store/effect/selectors';
import { SettingsActions } from 'store/settings/actions';

export const QueueSubtoolbar = () => {
  const dispatch = useAppDispatch();
  const eventDispatch = useEventDispatch();

  const settings = useAppSelector(SettingSelectors.settings);

  const ranges: number[] = [];
  const { queueIndex } = settings;
  const rangeStart = Math.max(queueIndex - 2, 0);
  const rangeEnd = rangeStart + 5;
  for (let i = rangeStart; i < rangeEnd; i++) {
    ranges.push(i);
  }

  const byEffectIndex = useAppSelector((state) => EffectSelectors.allByPageAndEffectIndex(state, settings.pageId));

  const changeQueueIndex = (targetIndex: number, play: boolean): void => {
    dispatch(
      documentSettingsSlice.actions.setQueueIndex({
        queueIndex: targetIndex,
        play: play,
      }),
    );
  };

  const onPresentationStartClick = (): void => {
    dispatch(documentSettingsSlice.actions.setPresentationMode(true));
    document.documentElement.requestFullscreen();
  };

  return (
    <QueueScrollArea.Root className={styles.Container}>
      <QueueScrollArea.Viewport>
        <div className={styles.ItemRoot}>
          <div className={styles.ItemGroup}>
            <QueueIconButton onClick={console.log}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-go-back-line'} />
            </QueueIconButton>

            <QueueIconButton onClick={console.log}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-go-forward-line'} />
            </QueueIconButton>

            <QueueIconButton>
              <SvgRemixIcon width={15} height={15} icon={'ri-file-copy-line'} />
            </QueueIconButton>

            <QueueIconButton>
              <SvgRemixIcon width={15} height={15} icon={'ri-clipboard-line'} />
            </QueueIconButton>

            <QueueIconButton onClick={onPresentationStartClick}>
              <SvgRemixIcon width={15} height={15} icon={'ri-slideshow-3-line'} />
            </QueueIconButton>

            <QueueToggle.Root size="small">
              <SvgRemixIcon width={15} height={15} icon={'ri-movie-line'} />
            </QueueToggle.Root>

            <QueueSeparator.Root orientation="vertical" decorative className={styles.Separator} />
          </div>

          <div className={styles.ItemGroup}>
            <QueueIconButton onClick={() => dispatch(SettingsActions.rewind())}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-left-s-fill'} />
            </QueueIconButton>
            <QueueIconButton onClick={() => changeQueueIndex(settings.queueIndex - 1, true)}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-left-line'} />
            </QueueIconButton>
            {ranges.map((queue) => (
              <QueueIconButton
                className={clsx(
                  styles.QueueIndicator,
                  byEffectIndex?.[queue] ? styles.HasEffect : '',
                  queue === settings.queueIndex ? styles.Current : '',
                )}
                key={queue}
                onClick={(): void => changeQueueIndex(queue, false)}>
                {queue + 1}
              </QueueIconButton>
            ))}
            <QueueIconButton onClick={() => changeQueueIndex(settings.queueIndex + 1, true)}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-right-line'} />
            </QueueIconButton>
            <QueueIconButton onClick={() => dispatch(SettingsActions.play())}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-right-s-fill'} />
            </QueueIconButton>
          </div>

          <div className={styles.ItemGroup}>
            <QueueSeparator.Root orientation="vertical" decorative className={styles.Separator} />

            <QueueIconButton onClick={() => eventDispatch(fitScreenSizeEvent())}>
              <SvgRemixIcon width={15} height={15} icon={'ri-fullscreen-fill'} />
            </QueueIconButton>
            <QueueIconButton onClick={() => dispatch(documentSettingsSlice.actions.decreaseScale())}>
              <SvgRemixIcon width={15} height={15} icon={'ri-subtract-line'} />
            </QueueIconButton>
            <QueueIconButton onClick={() => dispatch(documentSettingsSlice.actions.increaseScale())}>
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
