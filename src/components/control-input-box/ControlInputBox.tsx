import { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './ControlInputBox.module.scss';
import typeImg from './images/type.png';
import { usePrevious } from 'app/events/custom-hook';

export interface QueueControlInputBoxRootProps {
  children?: React.ReactNode;
  valueChanges?: (e: string) => void;
}

type QueueControlInputBoxUnitType = 'percent' | 'degree' | 'pt';

export interface QueueControlInputBoxAllProps {
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
  unit?: QueueControlInputBoxUnitType;
}

const setInitValue = (props: QueueControlInputBoxAllProps) => {
  const init = {...props};
  console.log(init);
};

const getUnitSymbol = (unit: QueueControlInputBoxUnitType): string => {
  if (unit === 'percent') {
    return '\u0025';
  }

  if (unit === 'degree') {
    return '\u00B0';
  }

  if (unit === 'pt') {
    return 'pt';
  }
};

const isValidateValue = (value: string): boolean => {
  return /^\d+(\u0025|\u00B0|pt)$/.test(value) || /^\d+$/.test(value);
};

const Root = ({ children, color, variant, margin, padding, ...props }: QueueControlInputBoxRootProps & QueueControlInputBoxAllProps) => {
  const initProps = setInitValue(props); // not yet...
  margin = '4px';
  console.log('initProps: ', initProps);
  return <div className={clsx(styles.TextInputRoot, styles[color], styles[variant])} {...props}
  style={{
    margin: margin ?? '8px',
    padding: padding ?? '6px 8px',
  }}>{children}</div>;
};

const Icon = ({iconImg}: Partial<QueueControlInputBoxAllProps> ) => {
  return (
    <div className={clsx(styles.Icon)}>
      <img src={iconImg ?? typeImg}></img>
    </div>
  );
};

const InputBox = ({placeholder, color, variant, unit='percent', valueChanges, ...props}: Partial<QueueControlInputBoxRootProps & QueueControlInputBoxAllProps> ) => {
  const [text, setText] = useState('');

  useEffect(() => {
    // console.log('useEffect start');

    return () => {
      // console.log('userEffect bye');
    };
  }, []);

  const prevText = usePrevious(text); // 흠 내가 원하는 동작이 아닌데. 직전에 성공한 값을 가지고 있고 싶음
  const unitSymbol = getUnitSymbol(unit);

  return (
    <div className={clsx(styles.InputBox)}>
    <input
      placeholder={placeholder ?? unitSymbol}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          const isValid = isValidateValue(text);
          console.log('isValid: ', isValid);


          if (isValid) {
            valueChanges(text);
            setText(text.replace(unitSymbol, '') + unitSymbol);
            return;
          }

          setText((prevText as string).replace(unitSymbol, '') + unitSymbol);
        }
      }}
    />
    </div>
  );
};

const IconInputComponent = ({color = 'grey', variant = 'filled', ...props}: QueueControlInputBoxRootProps & QueueControlInputBoxAllProps) => {
  return (
    <QueueControlInputBoxComponent.Root {...props} color={color} variant={variant}>
      <QueueControlInputBoxComponent.Icon {...props}></QueueControlInputBoxComponent.Icon>
      <QueueControlInputBoxComponent.InputBox {...props}></QueueControlInputBoxComponent.InputBox>
    </QueueControlInputBoxComponent.Root>
  );
};

const InputComponent =  ({color = 'grey', variant = 'filled', ...props}: QueueControlInputBoxRootProps & QueueControlInputBoxAllProps) => {
  // const { label, subDescription } = props;
  return (
    <QueueControlInputBoxComponent.Root {...props} color={color} variant={variant}>
      <QueueControlInputBoxComponent.InputBox  {...props}></QueueControlInputBoxComponent.InputBox>
    </QueueControlInputBoxComponent.Root>
  );
};

export const QueueControlInputBoxComponent = {
  Root,
  Icon,
  InputBox,
  IconInput: IconInputComponent,
  Input: InputComponent,
};
