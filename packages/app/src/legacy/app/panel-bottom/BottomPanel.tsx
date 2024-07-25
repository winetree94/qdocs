import clsx from 'clsx';
import { Timeline } from '@legacy/components/timeline/Timeline';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { SettingsActions, SettingSelectors } from '@legacy/store/settings';
import { store } from '@legacy/store';
import {
  RiForwardEndMiniLine,
  RiPlayMiniLine,
  RiRepeatLine,
  RiRewindStartMiniLine,
  RiSkipBackMiniLine,
  RiSkipForwardMiniLine,
} from '@remixicon/react';
import { Button, Separator, Slider, IconButton } from '@radix-ui/themes';
import { Toggle } from '@radix-ui/react-toggle';

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

export const BottomPanel = memo(function BottomPanel() {
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
          <IconButton
            onClick={() => dispatch(SettingsActions.goToIn())}>
            <RiRewindStartMiniLine />
          </IconButton>
          <IconButton
            onClick={() => changeQueueIndex(-1, true)}>
            <RiSkipBackMiniLine />
          </IconButton>
          <IconButton
            onClick={() => dispatch(SettingsActions.play())}>
            <RiPlayMiniLine />
          </IconButton>
          <IconButton
            onClick={() => changeQueueIndex(+1, true)}>
            <RiSkipForwardMiniLine />
          </IconButton>
          <IconButton
            onClick={() => dispatch(SettingsActions.goToOut())}>
            <RiForwardEndMiniLine />
          </IconButton>
        </div>

        {/* right */}

        <div
          className={clsx(
            'tw-flex-1',
            'tw-flex',
            'tw-items-center',
            'tw-justify-end',
          )}>
          
          <Toggle
            className={clsx('tw-w-4')}
            pressed={autoPlayRepeat}
            onPressedChange={(e) => dispatch(SettingsActions.setRepeat(e))}>
            <RiRepeatLine /> {autoPlayRepeat ? 'ON' : 'OFF'}
          </Toggle>

          <Separator className='tw-mx-2' orientation="vertical" />

          <Slider
            size="1" 
            className={clsx('tw-w-[73px]', 'tw-ml-5', 'tw-mr-5')}
            min={1}
            max={9}
            value={[zoom]}
            step={1}
            onValueChange={([e]) =>
              setZoom(e as ZOOM_LEVEL_KEYS)
            }
          ></Slider>
        </div>
      </div>
      <Timeline columnWidth={ZOOM_LEVEL[zoom]} />
    </div>
  );
});
