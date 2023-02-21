import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import styles from './ScrollArea.module.scss';
import clsx from 'clsx';

export const Root: React.ForwardRefExoticComponent<ScrollArea.ScrollAreaProps & React.RefAttributes<HTMLDivElement>> =
  React.forwardRef(({ className, children, ...props }, ref) => {
    return (
      <ScrollArea.Root {...props} ref={ref} className={clsx(className, styles.ScrollAreaRoot)}>
        {children}
      </ScrollArea.Root>
    );
  });

export const Viewport: React.ForwardRefExoticComponent<
  ScrollArea.ScrollAreaViewportProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <ScrollArea.Viewport {...props} ref={ref} className={clsx(className, styles.ScrollAreaViewport)}>
      {children}
    </ScrollArea.Viewport>
  );
});

export const Scrollbar: React.ForwardRefExoticComponent<
  ScrollArea.ScrollAreaScrollbarProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <ScrollArea.Scrollbar {...props} ref={ref} className={clsx(className, styles.ScrollAreaScrollbar)}>
      {children}
    </ScrollArea.Scrollbar>
  );
});

export const Thumb: React.ForwardRefExoticComponent<
  ScrollArea.ScrollAreaThumbProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <ScrollArea.Thumb {...props} ref={ref} className={clsx(className, styles.ScrollAreaThumb)}>
      {children}
    </ScrollArea.Thumb>
  );
});

export const Corner: React.ForwardRefExoticComponent<
  ScrollArea.ScrollAreaCornerProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <ScrollArea.Corner {...props} ref={ref} className={clsx(className, styles.ScrollAreaCorner)}>
      {children}
    </ScrollArea.Corner>
  );
});

export const QueueScrollArea = {
  Root,
  Viewport,
  Scrollbar,
  Thumb,
  Corner,
};
