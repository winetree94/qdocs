import React from 'react';

export interface ScaleProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  scale?: number;
}

export const Scale = ({ scale, ...props }: ScaleProps) => {
  return <div {...props}></div>;
};
