import { forwardRef } from 'react';
import clsx from 'clsx';
import * as RadixTab from '@radix-ui/react-tabs';
import styles from './Tabs.module.scss';

interface TabProps {
  tabs: Tabs[];
}

export interface Tabs {
  name: string;
  content: JSX.Element;
}

const QueueTab = forwardRef<HTMLDivElement, TabProps>(
  ({ tabs, ...props }, ref) => {
    return (
      <RadixTab.Root
        ref={ref}
        {...props}
        className={clsx(styles.TabsRoot)}
        defaultValue={tabs[0].name}>
        {/* tab list */}
        <RadixTab.List className={clsx(styles.TabsList)}>
          {tabs.map((tab, index) => (
            <RadixTab.Trigger
              className={clsx(styles.TabsTrigger)}
              value={tab.name}
              key={tab.name + 'list'}>
              {tab.name}
            </RadixTab.Trigger>
          ))}
        </RadixTab.List>

        {/* tab content */}
        <div>
          {tabs.map((tab, index) => (
            <RadixTab.Content
              className={clsx(styles.TabsContent)}
              value={tab.name}
              key={tab.name + 'content'}>
              {tab.content}
            </RadixTab.Content>
          ))}
        </div>
      </RadixTab.Root>
    );
  },
);

export default QueueTab;
