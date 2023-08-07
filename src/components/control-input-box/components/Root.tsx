import clsx from 'clsx';

import { QueueControlInputWrapperProps } from '../model';
import styles from '../ControlInputBox.module.scss';


const Root = ({ children, color, variant, margin, padding = '4px', width, ...props }: QueueControlInputWrapperProps) => {
    // const initProps = setInitValue(props); // not yet...
    // console.log('initProps: ', initProps);
    return <div className={clsx(styles.TextInputRoot, styles[color], styles[variant])} {...props}
    style={{
      margin: margin ?? '8px',
      padding: padding ?? '6px 8px',
      width: width ?? '50px',
    }}>{children}</div>;
  };

  export default Root;