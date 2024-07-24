import React, { useState, ChangeEvent } from 'react';
import { QueueRadioProps } from './Radio.model';
import QueueRadio from './Radio';

const QueueRadioGroup = (prop: { radioData: QueueRadioProps[] }) => {
  const [radioOptions, setRadioOptions] = useState<QueueRadioProps[]>(
    prop.radioData,
  );

  const radioOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRadioOptions((prev) =>
      prev.map((option) => {
        return {
          ...option,
          checked: option.id === e.target.id,
        };
      }),
    );
  };

  return (
    <>
      {radioOptions.map((option, index) => (
        <QueueRadio
          key={option.id}
          id={option.id}
          name={option.name}
          value={option.value}
          label={option.label}
          checked={option.checked}
          disabled={option.disabled}
          radioColor={option.radioColor}
          radioSize={option.radioSize}
          radioOnChange={(e) => {
            option.radioOnChange && option.radioOnChange(e);
            radioOnChange(e);
          }}>
          {option.label}
        </QueueRadio>
      ))}
    </>
  );
};

export default QueueRadioGroup;
