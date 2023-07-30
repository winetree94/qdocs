import { useState } from 'react';
import clsx from 'clsx';
import styles from './TextInput.module.scss';
import typeImg from './images/type.png';

export interface QueueTextInputRootProps {
  children?: React.ReactNode;
}

export interface QueueTextInputAllProps {
  placeholder?: string;
  defaultValue?: string;
  variant?: 'outline' | 'filled' | 'standard';
  type?: 'text' | 'number';
  size?: string;
  margin?: string;
  padding?: string;
  color?: string;
  label?: string;
  subDescription?: string;
  iconImg?: string;
  width?: string;
}

const setInitValue = (props: QueueTextInputAllProps) => {
  const init = {...props};
  console.log(init);
};

export const QueueTextInputRoot = ({ children, color, variant, margin, padding, ...props }: QueueTextInputRootProps & QueueTextInputAllProps) => {
  const initProps = setInitValue(props);
  margin = '4px';
  console.log('initProps: ', initProps);
  return <div className={clsx(styles.TextInputRoot, styles[color], styles[variant])} {...props}
  style={{
    margin: margin ?? '8px',
    padding: padding ?? '6px 8px',
  }}>{children}</div>;
};

export const QueueTextInputIcons = ({iconImg}: Partial<QueueTextInputAllProps> ) => {
  return (
    <div className={clsx(styles.Icon)}>
      <img src={iconImg ?? typeImg}></img>
    </div>
  );
};

export const QueueTextInputBox = ({placeholder, color, variant, ...props}: Partial<QueueTextInputAllProps> ) => {
  const [text, setText] = useState('');

  return (
    <input
      className={clsx(styles.InputBox, 'tw-text-xs')}
      value={text}
      placeholder={placeholder ?? 'test'}
      onChange={(e) => {
        console.log('e: ', e);
        setText(e.target.value);
      }}
    />
  );
};

export const QueueTextIconInput = ({color, variant, ...props}: QueueTextInputAllProps) => {
  return (
    <QueueTextInputComponent.Root {...props} color={color ?? 'grey'} variant={variant ?? 'filled'}>
      <QueueTextInputComponent.Icons {...props}></QueueTextInputComponent.Icons>
      <QueueTextInputComponent.InputBox {...props}></QueueTextInputComponent.InputBox>
    </QueueTextInputComponent.Root>
  );
};

export const QueueTextInput =  ({color, variant, ...props}: QueueTextInputAllProps) => {
  // const { label, subDescription } = props;
  return (
    <QueueTextInputComponent.Root {...props} color={color ?? 'grey'} variant={variant ?? 'filled'}>
      <QueueTextInputComponent.InputBox  {...props}></QueueTextInputComponent.InputBox>
    </QueueTextInputComponent.Root>
  );
};

export const QueueTextInputComponent = {
  Root: QueueTextInputRoot,
  Icons: QueueTextInputIcons,
  InputBox: QueueTextInputBox,
  TextIconInput: QueueTextIconInput,
  TextInput: QueueTextInput,
};
