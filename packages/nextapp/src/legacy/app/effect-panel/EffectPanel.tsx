import clsx from 'clsx';
import { EffectControllerBox } from '@legacy/components/effect-controller';
import { useAppSelector } from '@legacy/store/hooks';
import { SettingSelectors } from '@legacy/store/settings/selectors';
import { QueueScrollArea } from '@legacy/components/scroll-area/ScrollArea';

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
