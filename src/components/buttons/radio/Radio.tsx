import React, { useMemo, useEffect, useState, useLayoutEffect } from 'react';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import styles from './Radio.module.scss';
import clsx from 'clsx';
import { QueueRadioProps } from './Radio.model';

const QueueRadio = ({
  id,
  name,
  value,
  label,
  checked,
  initialChecked,
  disabled = false,
  radioOnChange,
  radioSize = QUEUE_UI_SIZE.MEDIUM,
  radioColor = QUEUE_UI_COLOR.DEFAULT,
  useIcon = true,
}: QueueRadioProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(!!initialChecked);

  useEffect(() => {
    setIsChecked(!!initialChecked);
  }, []);

  useLayoutEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const Icon = useMemo(() => {
    return {
      on: (
        <SvgRemixIcon
          icon="ri-radio-button-fill"
          size={radioSize}
          color={disabled ? styles.Disabled : radioColor}
          className={clsx(styles.RadioIcon, disabled && styles.Disabled)}
        />
      ),
      off: (
        <SvgRemixIcon
          icon="ri-radio-button-line"
          size={radioSize}
          color={disabled ? styles.Disabled : radioColor}
          className={clsx(styles.RadioIcon)}
        />
      ),
    };
  }, [isChecked, radioSize, radioColor, useIcon]);

  return (
    <>
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        disabled={disabled}
        onChange={radioOnChange}
        className={clsx(styles.RadioLabel, styles.RadioInput)}
      />
      <label
        htmlFor={id}
        className={clsx(
          styles.QueueRadio,
          styles.RadioLabel,
          styles[radioSize],
          disabled && styles.Disabled,
        )}>
        {useIcon ? (isChecked ? Icon.on : Icon.off) : null}
        <span className={clsx(styles.RadioChildren)}>{label}</span>
      </label>
    </>
  );
};

export default QueueRadio;
