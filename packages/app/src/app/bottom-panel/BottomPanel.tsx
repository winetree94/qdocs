import clsx from 'clsx';
import { QueueIconButton } from '@legacy/components/buttons/button/Button';
import { QueueSlider } from '@legacy/components/slider/Slider';
import { Timeline } from '@legacy/components/timeline/Timeline';
import { QueueToggle } from '@legacy/components/toggle/Toggle';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { SettingsActions, SettingSelectors } from '@legacy/store/settings';
import { QUEUE_UI_SIZE } from '@legacy/styles/ui/Size';
import { QueueSeparator } from '@legacy/components/separator/Separator';
import { store } from '@legacy/store';
import {
  RiForwardEndMiniLine,
  RiPlayMiniLine,
  RiRepeatLine,
  RiRewindStartMiniLine,
  RiSkipBackMiniLine,
  RiSkipForwardMiniLine,
} from '@remixicon/react';

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
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [zoom, setZoom] = React.useState<ZOOM_LEVEL_KEYS>(5);
  const autoPlayRepeat = useAppSelector(SettingSelectors.autoPlayRepeat);

  const changeQueueIndex = (targetIndex: number, play: boolean): void => {
    const queueIndex = SettingSelectors.queueIndex(store.getState());
    const targetQueueIndex = Math.max(queueIndex + targetIndex, 0);

    if (queueIndex === targetQueueIndex) {
      return;
    }

    dispatch(
      SettingsActions.setQueueIndex({
        queueIndex: targetQueueIndex,
        play: play,
      }),
    );
  };

  return (
    <div className={clsx('tw-flex', 'tw-flex-col', 'tw-flex-1', 'tw-h-full')}>
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
        <div
          className={clsx(
            'tw-flex-1',
            'tw-flex',
            'tw-justify-center',
            'tw-gap-2',
          )}>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => dispatch(SettingsActions.goToIn())}>
            <RiRewindStartMiniLine />
          </QueueIconButton>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => changeQueueIndex(-1, true)}>
            <RiSkipBackMiniLine />
          </QueueIconButton>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => dispatch(SettingsActions.play())}>
            <RiPlayMiniLine />
          </QueueIconButton>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => changeQueueIndex(+1, true)}>
            <RiSkipForwardMiniLine />
          </QueueIconButton>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => dispatch(SettingsActions.goToOut())}>
            <RiForwardEndMiniLine />
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
            className={clsx('tw-w-4')}
            pressed={autoPlayRepeat}
            onPressedChange={(e) => dispatch(SettingsActions.setRepeat(e))}
            size={QUEUE_UI_SIZE.MEDIUM}>
            <RiRepeatLine />
          </QueueToggle.Root>

          <QueueSeparator.Root
            className={clsx('!tw-h-4', 'tw-ml-2', 'tw-mr-1')}
            orientation="vertical"
          />

          <QueueSlider
            className={clsx('tw-w-[73px]', 'tw-ml-5', 'tw-mr-5')}
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
