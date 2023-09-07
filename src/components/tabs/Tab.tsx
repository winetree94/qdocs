import { forwardRef } from 'react';
import clsx from 'clsx';
import * as RadixTab from '@radix-ui/react-tabs';
import styles from './Tabs.module.scss';

interface TabProps extends RadixTab.TabsProps {
  tabs: Tabs[];
}

export interface Tabs {
  id: string;
  label: string;
  disabled?: boolean;
  onClick?: RadixTab.TabsTriggerProps['onClick'];
  content: JSX.Element;
}

const QueueTab = forwardRef<HTMLDivElement, TabProps>(
  ({ tabs, className, ...props }, ref) => {
    return (
      <RadixTab.Root
        ref={ref}
        {...props}
        className={clsx(styles.TabsRoot, className)}
        defaultValue={props.defaultValue || tabs[0].id}>
        {/* tab list */}
        <RadixTab.List className={clsx(styles.TabsList)}>
          {tabs.map((tab) => (
            <RadixTab.Trigger
              className={clsx(styles.TabsTrigger)}
              value={tab.id}
              disabled={tab.disabled}
              key={tab.id + 'list'}
              onClick={tab.onClick}>
              {tab.label}
            </RadixTab.Trigger>
          ))}
        </RadixTab.List>

        {/* tab content */}
        {tabs.map((tab) => (
          <RadixTab.Content
            className={clsx(styles.TabsContent)}
            value={tab.id}
            key={tab.id + 'content'}>
            {tab.content}
          </RadixTab.Content>
        ))}
      </RadixTab.Root>
    );
  },
);

export default QueueTab;
