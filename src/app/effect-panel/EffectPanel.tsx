import clsx from 'clsx';
import { EffectControllerBox } from 'components';
import { useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';

export const PanelTabType = {
  Styler: 'styler',
  DefaultProp: 'DefaultProp',
} as const;

export const EffectPanel = () => {
  const selectedObjectIds = useAppSelector(SettingSelectors.selectedObjectIds);

  if (selectedObjectIds.length <= 0) {
    return null;
  }

  return (
    <div className={clsx('tw-flex', 'tw-flex-col', 'tw-h-full')}>
      <div className="tw-h-full">
        <QueueScrollArea.Root className="tw-h-full">
          <QueueScrollArea.Viewport>
            <EffectControllerBox />
          </QueueScrollArea.Viewport>
          <QueueScrollArea.Scrollbar>
            <QueueScrollArea.Thumb />
          </QueueScrollArea.Scrollbar>
        </QueueScrollArea.Root>
      </div>
    </div>
  );
};
