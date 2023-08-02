import clsx from 'clsx';

import { QueueControlInputBoxAllProps } from '../model';
import styles from '../ControlInputBox.module.scss';
import typeImg from '../images/type.png';

const PrefixIcon = ({iconImg}: Partial<QueueControlInputBoxAllProps> ) => {
    return (
      <div className={clsx(styles.Icon)}>
        <img src={iconImg ?? typeImg} alt="input-prefix-img"></img>
      </div>
    );
  };

  export default PrefixIcon;