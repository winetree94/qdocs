import { FunctionComponent } from 'react';
import clsx from 'clsx';
import styles from './LeftPanel.module.scss';
import { ObjectPanel } from './object-panel/ObjectPanel';
import { QueueTabs } from 'components/tabs/Tabs';
import { DefaultPropPanel } from './default-prop-panel/DefaultPropPanel';
import { EffectControllerBox } from 'components';
import { useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';

export const PanelTabType = {
  Styler: 'styler',
  DefaultProp: 'DefaultProp',
} as const;

export const LeftPanel: FunctionComponent = () => {
  const settings = useAppSelector(SettingSelectors.settings);
  const hasSelectedObjects = settings.selectedObjectUUIDs.length > 0;

  return (
    <div className={clsx(styles.container, 'flex', 'flex-col')}>
      {hasSelectedObjects ? (
        <QueueTabs.Root className="h-full" defaultValue={PanelTabType.Styler}>
          <QueueTabs.List>
            <QueueTabs.Trigger value={PanelTabType.Styler}>Effects</QueueTabs.Trigger>
            <QueueTabs.Trigger value={PanelTabType.DefaultProp}>Default</QueueTabs.Trigger>
          </QueueTabs.List>
          <QueueTabs.Content value={PanelTabType.Styler}>
            <EffectControllerBox />
          </QueueTabs.Content>
          <QueueTabs.Content value={PanelTabType.DefaultProp}>
            <DefaultPropPanel />
          </QueueTabs.Content>
        </QueueTabs.Root>
      ) : (
        <ObjectPanel />
      )}
    </div>
  );
};
