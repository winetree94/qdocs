import { forwardRef } from 'react';
import { RemixIconClasses } from './factory';

export interface SvgRemixIconProps extends React.SVGProps<SVGSVGElement> {
  icon: typeof RemixIconClasses[number];
}

export const SvgRemixIcon: React.ForwardRefExoticComponent<
  SvgRemixIconProps & React.RefAttributes<SVGSVGElement>
> = forwardRef(({
  icon,
  ...props
}, ref) => {
  return (
    <svg
      ref={ref}
      width="15"
      height="15"
      {...props}>
      <use href={`/remixicon.symbol.svg#${icon}`}></use>
    </svg>
  );
});
