/* eslint-disable @typescript-eslint/restrict-plus-operands */
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { getUnitSymbol, isValidateValue, isValidLimit } from '../utils';
import styles from '../ControlInputBox.module.scss';
import { QueueControlInputBoxProps } from '../model';

const InputBox = ({
  placeholder,
  valueChangeEvent,
  minValue = 0,
  maxValue = 100,
  padding,
  unit = 'percent',
  ...props
}: Partial<QueueControlInputBoxProps>) => {
  const [text, setText] = useState<string>('');
  const [prevValue, setPrevValue] = useState<number>(0);

  useEffect(() => {
    // console.log('useEffect start');

    return () => {
      // console.log('userEffect bye');
    };
  }, []);

  const unitSymbol = getUnitSymbol(unit);

  return (
    <div className={clsx(styles.InputBox)} style={{ padding: padding ?? 0 }}>
      <input
        placeholder={placeholder ?? unitSymbol}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const next = parseInt(text.replace(unitSymbol, ''), 10);

            if (isValidateValue(text) && isValidLimit(next, maxValue)) {
              setPrevValue(next);
              setText(next + unitSymbol);
              valueChangeEvent(next);
              return;
            }

            if (prevValue) {
              setText(prevValue + unitSymbol);
              return;
            }

            setText('');
            return;
          }

          if (e.key === 'ArrowDown') {
            const next = prevValue === 0 ? prevValue : prevValue - 1;
            setText(next + unitSymbol);
            setPrevValue(next);
            valueChangeEvent(next);
            return;
          }

          if (e.key === 'ArrowUp') {
            const next = prevValue === maxValue ? prevValue : prevValue + 1;
            setText(next + unitSymbol);
            setPrevValue(next);
            valueChangeEvent(next);
            return;
          }
        }}
      />
    </div>
  );
};

export default InputBox;
