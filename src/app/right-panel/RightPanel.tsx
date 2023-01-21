import clsx from 'clsx';
import { HTMLAttributes, PropsWithChildren, ReactElement } from 'react';
import classes from './RightPanel.module.scss';

export const RightPanel = ({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>): ReactElement => {
  return (
    <div
      id="right-panel-root"
      className={clsx(classes.root, className)}
      {...props}
    >
      <div>Right panel</div>
    </div>
  );
};
