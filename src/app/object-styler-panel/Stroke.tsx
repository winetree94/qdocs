import { Slider } from 'components';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings';
import classes from './ObjectStyler.module.scss';

export const ObjectStyleStroke = () => {
  const objects = useAppSelector(SettingSelectors.selectedObjects);
  const [firstObject] = objects;

  const tempType = firstObject;
  const [width, setWidth] = useState([tempType.stroke.width]);

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setWidth([parseInt(e.currentTarget.value, 10)]);
  };

  useEffect(() => {
    setWidth([tempType.stroke.width]);
  }, [tempType]);

  if (firstObject.type === 'icon') {
    return null;
  }

  return (
    <div>
      <div className="mb-1">
        <p className="font-medium">Border</p>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <input type="text" name="strokeWidth" value={width[0]} readOnly hidden />
          <p className="text-sm">width</p>
          <div className="flex items-center gap-2">
            <div className="w-1/3">
              <input className="w-full" type="number" value={width[0]} onChange={handleWidthChange} />
            </div>
            <div className="flex items-center w-full">
              <Slider min={0} max={100} value={width} onValueChange={setWidth} />
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm">color</p>
          <div className="w-6 h-6">
            <label className={classes['input-color']} style={{ backgroundColor: firstObject.stroke.color }}>
              <input
                type="color"
                name="strokeColor"
                id="strokeColor"
                className={classes['input-color']}
                defaultValue={firstObject.stroke.color}
              />
            </label>
          </div>
        </div>
        <div>
          <p className="text-sm">style</p>
          <div>
            <select defaultValue={firstObject.stroke.dasharray}>
              <option value="solid">--------</option>
              <option value="">- - - - -</option>
              <option value="">-- -- --</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
