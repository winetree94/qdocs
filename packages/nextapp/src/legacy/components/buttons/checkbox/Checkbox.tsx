import React, { ReactNode, ChangeEvent, useMemo } from 'react';
import { QUEUE_UI_SIZE, QUEUE_UI_SIZES } from '@legacy/styles/ui/Size';
import { QUEUE_UI_COLOR, QUEUE_UI_COLORS } from '@legacy/styles/ui/Color';
import styles from './Checkbox.module.scss';
import clsx from 'clsx';
import { RiCheckboxBlankFill, RiCheckboxFill } from '@remixicon/react';

export interface QueueCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  value: any;
  checked?: boolean;
  disabled?: boolean;
  checkBoxOnChange?: (e: ChangeEvent<HTMLInputElement>) => void;
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
  disabled = false,
  checkBoxOnChange,
  checkboxSize = QUEUE_UI_SIZE.MEDIUM,
  checkboxColor = QUEUE_UI_COLOR.DEFAULT,
  useIcon = true,
  children,
}: QueueCheckboxProps) => {
  const Icon = useMemo(() => {
    return {
      on: (
        // <SvgRemixIcon
        //   icon="ri-checkbox-fill"
        //   size={checkboxSize}
        //   color={disabled ? styles.Disabled : checkboxColor}
        //   className={clsx(styles.CheckboxIcon, disabled && styles.Disabled)}
        // />
        <RiCheckboxFill
          className={clsx(
            styles.CheckboxIcon,
            disabled && styles.Disabled,
            disabled ? styles.Disabled : checkboxColor,
          )}
          size={16}
        />
      ),
      off: (
        // <SvgRemixIcon
        //   icon="ri-checkbox-blank-line"
        //   size={checkboxSize}
        //   color={disabled ? styles.Disabled : checkboxColor}
        //   className={clsx(styles.CheckboxIcon)}
        // />
        <RiCheckboxBlankFill
          className={clsx(
            styles.CheckboxIcon,
            disabled ? styles.Disabled : checkboxColor,
          )}
          size={16}
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
        disabled={disabled}
        onChange={checkBoxOnChange}
        className={clsx(styles.QueueCheckbox, styles.CheckboxInput)}
      />
      <label
        htmlFor={id}
        className={clsx(
          styles.QueueCheckbox,
          styles.CheckboxLabel,
          styles[checkboxSize],
          disabled && styles.Disabled,
        )}>
        {useIcon ? (checked ? Icon.on : Icon.off) : null}
        <span className={clsx(styles.CheckboxChildren)}>{children}</span>
      </label>
    </>
  );
};

export default QueueCheckbox;
