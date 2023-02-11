import React from 'react';

export interface ScaleProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  scale?: number;
}

export const Scale: React.FunctionComponent<ScaleProps> = ({
  scale,
  ...props
}) => {
  return <div {...props}></div>;
};
