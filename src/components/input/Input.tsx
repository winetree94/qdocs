import styles from './Input.module.scss';
import { FunctionComponent } from 'react';
import clsx from 'clsx';

export const Input: FunctionComponent<React.InputHTMLAttributes<HTMLInputElement>> = ({
  ...props
}) => {
  return (
    <input {...props} className={clsx(styles.input, props.className || '')} />
  );
};
