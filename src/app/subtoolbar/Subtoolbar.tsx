import { fitScreenSizeEvent } from 'app/events/event';
import { useEventDispatch } from 'cdk/hooks/event-dispatcher';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import clsx from 'clsx';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { QueueSeparator } from 'components/separator/Separator';
import { QueueToggle } from 'components/toggle/Toggle';
import { QueueIconButton } from 'components/buttons/button/Button';
import styles from './Subtoolbar.module.scss';
import { SettingSelectors } from 'store/settings/selectors';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { EffectSelectors } from 'store/effect/selectors';
import { SettingsActions } from 'store/settings/actions';
import { HistoryActions } from 'store/history';
import { HistorySelectors } from 'store/history/selectors';
import { ObjectActions } from 'store/object';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';

export const QueueSubtoolbar = () => {
  const dispatch = useAppDispatch();
  const eventDispatch = useEventDispatch();

  const history = useAppSelector(HistorySelectors.all);
  const settings = useAppSelector(SettingSelectors.settings);
  const byEffectIndex = useAppSelector((state) => EffectSelectors.allByPageAndEffectIndex(state, settings.pageId));

  const ranges: number[] = [];
  const { queueIndex } = settings;
  const rangeStart = Math.max(queueIndex - 2, 0);
  const rangeEnd = rangeStart + 5;
  for (let i = rangeStart; i < rangeEnd; i++) {
    ranges.push(i);
  }

  const changeQueueIndex = (targetIndex: number, play: boolean): void => {
    dispatch(
      SettingsActions.setQueueIndex({
        queueIndex: targetIndex,
        play: play,
      }),
    );
  };

  const onPresentationStartClick = (): void => {
    dispatch(SettingsActions.setPresentationMode(true));
  };

  return (
    <QueueScrollArea.Root className={styles.Container}>
      <QueueScrollArea.Viewport>
        <div className={styles.ItemRoot}>
          <div className={styles.ItemGroup}>
            {/* undo */}
            <QueueIconButton
              size={QUEUE_UI_SIZE.MEDIUM}
              onClick={() => dispatch(HistoryActions.Undo())}
              disabled={!history.previous.length}>
              <SvgRemixIcon icon={'ri-arrow-go-back-line'} />
            </QueueIconButton>

            {/* redo */}
            <QueueIconButton
              size={QUEUE_UI_SIZE.MEDIUM}
              onClick={() => dispatch(HistoryActions.Redo())}
              disabled={!history.future.length}>
              <SvgRemixIcon icon={'ri-arrow-go-forward-line'} />
            </QueueIconButton>

            {/* duplicate */}
            <QueueIconButton
              size={QUEUE_UI_SIZE.MEDIUM}
              onClick={() => {
                dispatch(HistoryActions.Capture());
                dispatch(ObjectActions.duplicate({ ids: settings.selectedObjectIds }));
              }}
              disabled={!settings.selectedObjectIds.length}>
              <SvgRemixIcon icon={'ri-file-copy-line'} />
            </QueueIconButton>

            {/* presentation mode */}
            <QueueIconButton size={QUEUE_UI_SIZE.MEDIUM} onClick={onPresentationStartClick}>
              <SvgRemixIcon icon={'ri-slideshow-3-line'} />
            </QueueIconButton>

            <QueueSeparator.Root orientation="vertical" decorative className={styles.Separator} />
          </div>

          <div className={styles.ItemGroup}>
            <QueueIconButton
              size={QUEUE_UI_SIZE.MEDIUM}
              onClick={() => changeQueueIndex(settings.queueIndex - 1, true)}>
              <SvgRemixIcon icon={'ri-arrow-left-line'} />
            </QueueIconButton>
            {ranges.map((queue) => (
              <QueueIconButton
                size={QUEUE_UI_SIZE.MEDIUM}
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
            <QueueIconButton
              size={QUEUE_UI_SIZE.MEDIUM}
              onClick={() => changeQueueIndex(settings.queueIndex + 1, true)}>
              <SvgRemixIcon icon={'ri-arrow-right-line'} />
            </QueueIconButton>
          </div>

          <div className={styles.ItemGroup}>
            <QueueIconButton size={QUEUE_UI_SIZE.MEDIUM} onClick={() => dispatch(SettingsActions.rewind())}>
              <SvgRemixIcon icon={'ri-rewind-line'} />
            </QueueIconButton>
            <QueueIconButton size={QUEUE_UI_SIZE.MEDIUM} onClick={() => dispatch(SettingsActions.forward())}>
              <SvgRemixIcon icon={'ri-speed-line'} />
            </QueueIconButton>
            <QueueIconButton size={QUEUE_UI_SIZE.MEDIUM} onClick={() => dispatch(SettingsActions.pause())}>
              <SvgRemixIcon icon={'ri-pause-line'} />
            </QueueIconButton>
            <QueueIconButton size={QUEUE_UI_SIZE.MEDIUM} onClick={() => dispatch(SettingsActions.play())}>
              <SvgRemixIcon icon={'ri-play-line'} />
            </QueueIconButton>
            <QueueToggle.Root
              pressed={settings.autoPlayRepeat}
              onPressedChange={(e) => dispatch(SettingsActions.setRepeat(e))}>
              <SvgRemixIcon icon={'ri-repeat-line'} />
            </QueueToggle.Root>

            <QueueSeparator.Root orientation="vertical" decorative className={styles.Separator} />

            <QueueIconButton size={QUEUE_UI_SIZE.MEDIUM} onClick={() => eventDispatch(fitScreenSizeEvent())}>
              <SvgRemixIcon icon={'ri-fullscreen-fill'} />
            </QueueIconButton>
            <QueueIconButton size={QUEUE_UI_SIZE.MEDIUM} onClick={() => dispatch(SettingsActions.decreaseScale())}>
              <SvgRemixIcon icon={'ri-subtract-line'} />
            </QueueIconButton>
            <QueueIconButton size={QUEUE_UI_SIZE.MEDIUM} onClick={() => dispatch(SettingsActions.increaseScale())}>
              <SvgRemixIcon icon={'ri-add-line'} />
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
