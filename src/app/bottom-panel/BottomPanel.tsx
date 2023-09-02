import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import clsx from 'clsx';
import { QueueIconButton } from 'components/buttons/button/Button';
import { QueueSlider } from 'components/slider/Slider';
import { Timeline } from 'components/timeline/Timeline';
import { QueueToggle } from 'components/toggle/Toggle';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingsActions, SettingSelectors } from 'store/settings';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { ReactComponent as PlayIcon } from 'assets/icons/play.svg';
import { ReactComponent as StepBackIcon } from 'assets/icons/step-back.svg';
import { ReactComponent as StepForwardIcon } from 'assets/icons/step-forward.svg';
import { ReactComponent as StepInIcon } from 'assets/icons/step-in.svg';
import { ReactComponent as StepOutIcon } from 'assets/icons/step-out.svg';

const ZOOM_LEVEL = {
  [1]: 30,
  [2]: 32,
  [3]: 34,
  [4]: 36,
  [5]: 40,
  [6]: 50,
  [7]: 70,
  [8]: 90,
  [9]: 110,
} as const;

type ZOOM_LEVEL_KEYS = keyof typeof ZOOM_LEVEL;

export const BottomPanel = memo(() => {
  const autoPlayRepeat = useAppSelector(SettingSelectors.autoPlayRepeat);
  const queueIndex = useAppSelector(SettingSelectors.queueIndex);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [zoom, setZoom] = React.useState<ZOOM_LEVEL_KEYS>(5);

  const changeQueueIndex = (targetIndex: number, play: boolean): void => {
    dispatch(
      SettingsActions.setQueueIndex({
        queueIndex: targetIndex,
        play: play,
      }),
    );
  };

  return (
    <div className={clsx('tw-flex', 'tw-flex-col', 'tw-flex-1', 'tw-h-full')}>
      {/*

      <QueueSubtoolbar className={clsx('tw-flex-shrink-0')} />
    */}
      <div
        className={clsx(
          'tw-flex',
          'tw-items-center',
          'tw-justify-start',
          'tw-flex-shrink-0',
          'tw-border-b',
        )}>
        {/* left */}
        <div className={clsx('tw-flex-1', 'tw-flex', 'tw-items-center')}>
          <p
            className={clsx(
              'tw-text-14',
              'tw-font-bold',
              'tw-ml-2',
              'tw-px-3',
              'tw-py-3',
            )}>
            {t('global.timeline')}
          </p>
        </div>

        {/* center */}
        <div className={clsx('tw-flex-1', 'tw-flex', 'tw-justify-center')}>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => dispatch(SettingsActions.rewind())}>
            <StepInIcon />
          </QueueIconButton>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => changeQueueIndex(queueIndex - 1, true)}>
            <StepBackIcon />
          </QueueIconButton>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => dispatch(SettingsActions.play())}>
            <PlayIcon />
          </QueueIconButton>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => changeQueueIndex(queueIndex + 1, true)}>
            <StepForwardIcon />
          </QueueIconButton>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => dispatch(SettingsActions.forward())}>
            <StepOutIcon />
          </QueueIconButton>
        </div>

        {/* right */}
        <div
          className={clsx(
            'tw-flex-1',
            'tw-flex',
            'tw-items-center',
            'tw-justify-end',
          )}>
          <QueueToggle.Root
            pressed={autoPlayRepeat}
            onPressedChange={(e) => dispatch(SettingsActions.setRepeat(e))}>
            <SvgRemixIcon icon={'ri-repeat-line'} />
          </QueueToggle.Root>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => dispatch(SettingsActions.pause())}>
            <SvgRemixIcon icon={'ri-pause-line'} />
          </QueueIconButton>

          <QueueSlider
            className={clsx('tw-w-[73px]', 'tw-mr-4')}
            disableRange={true}
            min={1}
            max={9}
            value={[zoom]}
            step={1}
            onValueChange={([e]) =>
              setZoom(e as ZOOM_LEVEL_KEYS)
            }></QueueSlider>
        </div>
      </div>
      <Timeline columnWidth={ZOOM_LEVEL[zoom]} />
    </div>
  );
});
