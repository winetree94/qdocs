import React, { forwardRef } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import styles from './Tabs.module.scss';
import clsx from 'clsx';

export const Root = forwardRef<HTMLDivElement, Tabs.TabsProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Tabs.Root ref={ref} {...props} className={clsx(styles.TabsRoot, className)}>
        {children}
      </Tabs.Root>
    );
  },
);

export const List = forwardRef<HTMLDivElement, Tabs.TabsListProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Tabs.List ref={ref} {...props} className={clsx(styles.TabsList, className)}>
        {children}
      </Tabs.List>
    );
  },
);

export const Trigger = forwardRef<HTMLButtonElement, Tabs.TabsTriggerProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Tabs.Trigger ref={ref} {...props} className={clsx(styles.TabsTrigger, className)}>
        {children}
      </Tabs.Trigger>
    );
  },
);

export const Content = forwardRef<HTMLDivElement, Tabs.TabsContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Tabs.Content ref={ref} {...props} className={clsx(styles.TabsContent, className)}>
        {children}
      </Tabs.Content>
    );
  },
);

export const QueueTabs = {
  Root,
  List,
  Trigger,
  Content,
};
