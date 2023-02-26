import clsx from 'clsx';
import { HTMLAttributes, ReactElement } from 'react';
import classes from './Color.module.scss';

export interface ColorProps extends HTMLAttributes<HTMLInputElement> {
  displayColor: string;
}

export const Color = ({ displayColor, className, ...props }: ColorProps): ReactElement => {
  return (
    <label className={clsx(className, classes['input-color'])} style={{ backgroundColor: displayColor }}>
      <input type="color" defaultValue={displayColor} {...props} />
    </label>
  );
};
