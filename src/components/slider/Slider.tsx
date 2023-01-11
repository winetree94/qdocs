import { forwardRef } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import classes from './Slider.module.scss';
import { clsx } from 'clsx';

const CustomSlider = forwardRef<HTMLScriptElement, SliderPrimitive.SliderProps>(
  ({ className, ...props }, forwardedRef) => {
    const value = props.value || props.defaultValue || [];
    const key = props.id || 'SliderThumb';

    return (
      <SliderPrimitive.Slider
        {...props}
        className={clsx(classes['slider-root'], className)}
        ref={forwardedRef}
      >
        <SliderPrimitive.Track className={classes['slider-track']}>
          <SliderPrimitive.Range className={classes['slider-range']} />
        </SliderPrimitive.Track>
        {value.map((_, i) => (
          <SliderPrimitive.Thumb
            key={`${key}-${i}`}
            className={classes['slider-thumb']}
          />
        ))}
      </SliderPrimitive.Slider>
    );
  }
);

export default CustomSlider;
