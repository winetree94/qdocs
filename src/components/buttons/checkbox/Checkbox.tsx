import React, { ReactNode, ChangeEvent, useMemo } from 'react';
import { QUEUE_UI_SIZE, QUEUE_UI_SIZES } from 'styles/ui/Size';
import { QUEUE_UI_COLOR, QUEUE_UI_COLORS } from 'styles/ui/Color';
import styles from './Checkbox.module.scss';
import clsx from 'clsx';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';

export interface QueueCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  value: any;
  checked?: boolean;
  onchange?: (e: ChangeEvent<HTMLInputElement>) => void;
  checkboxSize?: QUEUE_UI_SIZES;
  checkboxColor?: QUEUE_UI_COLORS;
  useIcon?: boolean;
  children?: ReactNode;
}
const QueueCheckbox = ({
  id,
  name,
  value,
  checked,
  onchange,
  checkboxSize = QUEUE_UI_SIZE.MEDIUM,
  checkboxColor = QUEUE_UI_COLOR.DEFAULT,
  useIcon = true,
  children,
}: QueueCheckboxProps) => {
  const Icon = useMemo(() => {
    return {
      on: (
        <SvgRemixIcon
          icon="ri-checkbox-fill"
          size={checkboxSize}
          color={checked ? checkboxColor : QUEUE_UI_COLOR.DEFAULT}
          className={clsx(styles.CheckboxIcon)}
        />
      ),
      off: (
        <SvgRemixIcon
          icon="ri-checkbox-blank-line"
          size={checkboxSize}
          color={checked ? checkboxColor : QUEUE_UI_COLOR.DEFAULT}
          className={clsx(styles.CheckboxIcon)}
        />
      ),
    };
  }, [checked, checkboxSize, checkboxColor, useIcon]);

  return (
    <>
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onchange}
        className={clsx(styles.QueueCheckbox, styles[checkboxSize], styles[checkboxColor], styles.CheckboxInput)}
      />
      <label htmlFor={id} className={clsx(styles.QueueCheckbox, styles[checkboxSize], styles[checkboxColor])}>
        {useIcon && checked ? Icon.on : Icon.off}
        <span>{children}</span>
      </label>
    </>
  );
};

export default QueueCheckbox;
