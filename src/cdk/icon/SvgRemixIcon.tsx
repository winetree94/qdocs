import { forwardRef } from 'react';
import { RemixIconClasses } from './factory';
import symbolPath from 'assets/remixicon.symbol.svg';
import styles from './SvgRemixIcon.module.scss';
import clsx from 'clsx';

export interface SvgRemixIconProps extends React.SVGProps<SVGSVGElement> {
  icon: typeof RemixIconClasses[number];
}

export const SvgRemixIcon: React.ForwardRefExoticComponent<SvgRemixIconProps & React.RefAttributes<SVGSVGElement>> =
  forwardRef(({ icon, className, ...props }, ref) => {
    return (
      <svg ref={ref} width="15" height="15" {...props} className={clsx(styles.SvgRemixIcon, className)}>
        <use href={`${symbolPath}#${icon}`}></use>
      </svg>
    );
  });
