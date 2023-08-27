import { QueueSubtoolbar } from 'app/subtoolbar/Subtoolbar';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import clsx from 'clsx';
import { QueueIconButton } from 'components/buttons/button/Button';
import { QueueSeparator } from 'components/separator/Separator';
import CustomSlider from 'components/slider/Slider';
import { Timeline } from 'components/timeline/Timeline';
import { QueueToggle } from 'components/toggle/Toggle';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingsActions, SettingSelectors } from 'store/settings';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';

export const BottomPanel = () => {
  const settings = useAppSelector(SettingSelectors.settings);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <div className={clsx('tw-flex', 'tw-flex-col', 'tw-flex-1')}>
      {/*

      <QueueSubtoolbar className={clsx('tw-flex-shrink-0')} />
      */}
      <div
        className={clsx(
          'tw-flex',
          'tw-items-center',
          'tw-justify-between',
          'tw-flex-shrink-0',
          'tw-border-b',
        )}>
        {/* left */}
        <div className={clsx('tw-flex', 'tw-items-center')}>
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

          <span className={clsx('tw-my-3', 'tw-mx-2', 'tw-h-full')}>
            <QueueSeparator.Root
              orientation="vertical"
              decorative></QueueSeparator.Root>
          </span>

          <p className={clsx('tw-text-14', 'tw-ml-2')}>00m : 13s : 00ms</p>
        </div>

        {/* center */}
        <div className={clsx('tw-flex')}>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => dispatch(SettingsActions.rewind())}>
            <SvgRemixIcon icon={'ri-rewind-line'} />
          </QueueIconButton>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => dispatch(SettingsActions.play())}>
            <SvgRemixIcon icon={'ri-play-line'} />
          </QueueIconButton>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => dispatch(SettingsActions.forward())}>
            <SvgRemixIcon icon={'ri-speed-line'} />
          </QueueIconButton>
        </div>

        {/* right */}
        <div className={clsx('tw-flex', 'tw-items-center')}>
          <QueueToggle.Root
            pressed={settings.autoPlayRepeat}
            onPressedChange={(e) => dispatch(SettingsActions.setRepeat(e))}>
            <SvgRemixIcon icon={'ri-repeat-line'} />
          </QueueToggle.Root>
          <QueueIconButton
            size={QUEUE_UI_SIZE.MEDIUM}
            onClick={() => dispatch(SettingsActions.pause())}>
            <SvgRemixIcon icon={'ri-pause-line'} />
          </QueueIconButton>

          <CustomSlider className={clsx('tw-w-10')}></CustomSlider>
        </div>
      </div>
      <Timeline />
    </div>
  );
};
