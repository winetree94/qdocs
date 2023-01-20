import { FunctionComponent } from 'react';

export interface QueueObjectContainerProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const QueueObjectContainer: FunctionComponent<QueueObjectContainerProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};