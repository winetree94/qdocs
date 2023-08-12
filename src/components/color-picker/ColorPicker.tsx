import React, { useState } from 'react';
import { SketchPicker, ColorResult, RGBColor } from 'react-color';
import { clsx } from 'clsx';
import styles from './ColorPicker.module.scss';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const QueueColorPicker = () => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState<RGBColor>({
    r: 241,
    g: 112,
    b: 19,
    a: 1,
  });
  const brightness = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  const arrowColor = brightness > 127.5 ? '#000' : '#fff';

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color: ColorResult) => {
    setColor(color.rgb);
  };

  const rgbDynamicStyle = {
    background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
  };

  return (
    <>
      <div className={styles.wrapper} onClick={handleClick}>
        <div className={clsx(styles.color)} style={rgbDynamicStyle} />
        <ChevronDownIcon
          className={clsx(styles.chevron)}
          style={{ color: arrowColor }}
        />
      </div>
      {displayColorPicker ? (
        <div className={styles.popover}>
          <div className={styles.cover} onClick={handleClose} />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </>
  );
};

export default QueueColorPicker;
