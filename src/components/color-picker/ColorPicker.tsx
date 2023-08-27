import { ChangeEvent, useEffect, useState } from 'react';
import {
  SketchPicker,
  ColorResult,
  SketchPickerProps,
  ColorChangeHandler,
} from 'react-color';
import { clsx } from 'clsx';
import styles from './ColorPicker.module.scss';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const QueueColorPicker = ({ onChange, ...props }: SketchPickerProps) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState<Partial<ColorResult>>({
    hex: props.color as string,
  });
  const brightness =
    0.299 * color.rgb?.r + 0.587 * color.rgb?.g + 0.114 * color.rgb?.b;
  const arrowColor = brightness > 127.5 ? '#000' : '#fff';

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange: ColorChangeHandler = (
    color: ColorResult,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setColor(color);
    onChange?.(color, event);
  };

  useEffect(() => {
    setColor({
      ...color,
      hex: props.color as string,
    });
  }, [props.color]);

  return (
    <>
      <div className={styles.wrapper} onClick={handleClick}>
        <div
          className={clsx(styles.color)}
          style={{ backgroundColor: color.hex }}
        />
        <ChevronDownIcon
          className={clsx(styles.chevron)}
          style={{ color: arrowColor }}
        />
      </div>
      {displayColorPicker ? (
        <div className={styles.popover}>
          <div className={styles.cover} onClick={handleClose} />
          <SketchPicker
            color={props.color}
            onChange={handleChange}
            {...props}
          />
        </div>
      ) : null}
    </>
  );
};

export default QueueColorPicker;
