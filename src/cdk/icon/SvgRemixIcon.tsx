import { forwardRef } from 'react';
import { RemixIconClasses } from './factory';
import symbolPath from 'assets/remixicon.symbol.svg';
import styles from './SvgRemixIcon.module.scss';
import clsx from 'clsx';
import { QUEUE_UI_SIZE, QUEUE_UI_SIZES } from 'styles/ui/Size';

export interface SvgRemixIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'> {
  icon: typeof RemixIconClasses[number];
  size?: QUEUE_UI_SIZES;
}

export const SvgRemixIcon: React.ForwardRefExoticComponent<SvgRemixIconProps & React.RefAttributes<SVGSVGElement>> =
  forwardRef(({ icon, className, size = QUEUE_UI_SIZE.MEDIUM, ...props }, ref) => {
    return (
      <svg ref={ref} {...props} className={clsx(styles.SvgRemixIcon, styles[size], className)}>
        <use href={`${symbolPath}#${icon}`}></use>
      </svg>
    );
  });
