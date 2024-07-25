import clsx from 'clsx';
import { EffectControllerBox } from '@/legacy/app/panel-right/effect-panel/effect-controller';
import { useAppSelector } from '@legacy/store/hooks';
import { SettingSelectors } from '@legacy/store/settings/selectors';
import { ScrollArea } from '@radix-ui/themes';

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
        <ScrollArea>
          <EffectControllerBox />
        </ScrollArea>
      </div>
    </div>
  );
};
