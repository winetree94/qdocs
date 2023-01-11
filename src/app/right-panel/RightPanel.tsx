import { FunctionComponent, useState } from 'react';
import { Slider } from '../../components';
import classes from './RightPanel.module.scss';

export const RightPanel: FunctionComponent = () => {
  const [sliderValue, setSliderValue] = useState([50]);

  const handleSliderValueChange = (value: number[]): void => {
    setSliderValue(value);
  };

  return (
    <div className={classes.container}>
      right panel
      <button className="mb-2 py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-500 hover:bg-green-600">
        Hello, Tailwind CSS!
      </button>
      <button className={classes['module-scss']}>Hello, Module scss</button>
      <div className="mt-4 p-2 box-border">
        <Slider
          min={0}
          max={100}
          value={sliderValue}
          onValueChange={handleSliderValueChange}
        />

        <p>Slider Value: {sliderValue[0]}</p>
      </div>
      <div className={classes['vertical-slider-box']}>
        <Slider
          orientation="vertical"
          min={0}
          max={100}
          value={sliderValue}
          onValueChange={handleSliderValueChange}
        />
      </div>
    </div>
  );
};
