import {
  FunctionComponent,
} from 'react';
import clsx from 'clsx';
import { useRecoilState } from 'recoil';
import { documentSettingsState } from '../../store/settings';
import { documentState } from '../../store/document';
import styles from './LeftPanel.module.scss';
import { StylerPanel } from 'app/styler-panel/StylerPanel';
import { ObjectPanel } from './object-panel/ObjectPanel';
import { QueueTabs } from 'components/tabs/Tabs';
import { DefaultPropPanel } from './default-prop-panel/DefaultPropPanel';

export const PanelTabType = {
  Styler: 'styler',
  DefaultProp: 'DefaultProp',
} as const;

export const LeftPanel: FunctionComponent = () => {
  const [queueDocument] = useRecoilState(documentState);
  const [settings] = useRecoilState(documentSettingsState);

  const selectedObjects = queueDocument!.pages[
    settings.queuePage
  ].objects.filter((object) =>
    settings.selectedObjectUUIDs.includes(object.uuid)
  );
  const hasSelectedObjects = selectedObjects.length > 0;

  return (
    <div className={clsx(styles.container, 'flex', 'flex-col')}>
      {hasSelectedObjects ? (
        <QueueTabs.Root defaultValue={PanelTabType.Styler}>
          <QueueTabs.List>
            <QueueTabs.Trigger value={PanelTabType.Styler}>
              Effects
            </QueueTabs.Trigger>
            <QueueTabs.Trigger value={PanelTabType.DefaultProp}>
              Default
            </QueueTabs.Trigger>
          </QueueTabs.List>
          <QueueTabs.Content value={PanelTabType.Styler}>
            <StylerPanel />
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
