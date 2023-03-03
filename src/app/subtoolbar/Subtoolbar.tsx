import { fitScreenSizeEvent } from 'app/events/event';
import { useEventDispatch } from 'cdk/hooks/event-dispatcher';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import clsx from 'clsx';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { QueueSeparator } from 'components/separator/Separator';
import { QueueToggle } from 'components/toggle/Toggle';
import { QueueIconButton } from '../../components/button/Button';
import styles from './Subtoolbar.module.scss';
import { SettingSelectors } from 'store/settings/selectors';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { EffectSelectors } from 'store/effect/selectors';
import { SettingsActions } from 'store/settings/actions';
import { HistoryActions } from 'store/history';
import { HistorySelectors } from 'store/history/selectors';
import { ObjectActions } from 'store/object';

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
            <QueueIconButton onClick={() => dispatch(HistoryActions.Undo())} disabled={!history.previous.length}>
              <SvgRemixIcon
                width={15}
                height={15}
                icon={'ri-arrow-go-back-line'}
                className={clsx(history.previous.length === 0 ? styles.Disabled : null)}
              />
            </QueueIconButton>

            <QueueIconButton onClick={() => dispatch(HistoryActions.Redo())} disabled={!history.future.length}>
              <SvgRemixIcon
                width={15}
                height={15}
                icon={'ri-arrow-go-forward-line'}
                className={clsx(history.future.length === 0 ? styles.Disabled : null)}
              />
            </QueueIconButton>

            <QueueIconButton
              onClick={() => {
                dispatch(HistoryActions.Capture());
                dispatch(ObjectActions.duplicate({ ids: settings.selectedObjectIds }));
              }}
              disabled={!settings.selectedObjectIds.length}>
              <SvgRemixIcon
                width={15}
                height={15}
                icon={'ri-file-copy-line'}
                className={clsx(settings.selectedObjectIds.length === 0 ? styles.Disabled : null)}
              />
            </QueueIconButton>

            <QueueIconButton disabled>
              <SvgRemixIcon width={15} height={15} icon={'ri-clipboard-line'} className={clsx(styles.Disabled)} />
            </QueueIconButton>

            <QueueIconButton onClick={onPresentationStartClick}>
              <SvgRemixIcon width={15} height={15} icon={'ri-slideshow-3-line'} />
            </QueueIconButton>

            <QueueSeparator.Root orientation="vertical" decorative className={styles.Separator} />
          </div>

          <div className={styles.ItemGroup}>
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
          </div>

          <div className={styles.ItemGroup}>
            <QueueIconButton onClick={() => dispatch(SettingsActions.rewind())}>
              <SvgRemixIcon width={15} height={15} icon={'ri-rewind-line'} />
            </QueueIconButton>
            <QueueIconButton onClick={() => dispatch(SettingsActions.forward())}>
              <SvgRemixIcon width={15} height={15} icon={'ri-speed-line'} />
            </QueueIconButton>
            <QueueIconButton onClick={() => dispatch(SettingsActions.pause())}>
              <SvgRemixIcon width={15} height={15} icon={'ri-pause-line'} />
            </QueueIconButton>
            <QueueIconButton onClick={() => dispatch(SettingsActions.play())}>
              <SvgRemixIcon width={15} height={15} icon={'ri-play-line'} />
            </QueueIconButton>
            <QueueToggle.Root
              pressed={settings.autoPlayRepeat}
              onPressedChange={(e) => dispatch(SettingsActions.setRepeat(e))}>
              <SvgRemixIcon width={15} height={15} icon={'ri-repeat-line'} />
            </QueueToggle.Root>

            <QueueSeparator.Root orientation="vertical" decorative className={styles.Separator} />

            <QueueIconButton onClick={() => eventDispatch(fitScreenSizeEvent())}>
              <SvgRemixIcon width={15} height={15} icon={'ri-fullscreen-fill'} />
            </QueueIconButton>
            <QueueIconButton onClick={() => dispatch(SettingsActions.decreaseScale())}>
              <SvgRemixIcon width={15} height={15} icon={'ri-subtract-line'} />
            </QueueIconButton>
            <QueueIconButton onClick={() => dispatch(SettingsActions.increaseScale())}>
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
