import clsx from 'clsx';

import { QueueControlInputPrefixIconProps } from '../model';
import styles from '../ControlInputBox.module.scss';
import typeImg from '../images/type.png';

const PrefixIcon = ({prefixType, prefixValue}: QueueControlInputPrefixIconProps ) => {
  switch(prefixType) {
    case 'img':
        return getImgElement(prefixValue);
    case 'class':
      return getClassElement(prefixValue);
    case 'svg':
      return getSvgElement(prefixValue);
    default:
      console.error('들어올 수 없는 케이스');
      break;
  }
};


const getImgElement = (value: string) => {
  // 하고 싶은 것: 이미지이름을 받아서 바로 뿌리는건데. 안되나 보다?.
  let imgPath = '';
  if (value === 'type') {
    imgPath = typeImg;
  }

  return (
    <div className={clsx(styles.Icon)}>
      <img src={imgPath} alt="input-prefix-img"></img>
    </div>
  );
};


const getClassElement = (value: string) => { // icon

  return (<div></div>);
};

const getSvgElement = (value: string) => {

  return (<div></div>);
};


export default PrefixIcon;