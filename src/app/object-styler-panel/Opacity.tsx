import { Slider } from 'components';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings';

export const ObjectStyleOpacity = () => {
  const objects = useAppSelector(SettingSelectors.selectedObjects);
  const [firstObject] = objects;
  const [opacity, setOpacity] = useState([firstObject.fade.opacity]);

  const handleOpacityChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setOpacity([parseInt(e.currentTarget.value, 10)]);
  };

  useEffect(() => {
    setOpacity([firstObject.fade.opacity]);
  }, [firstObject]);

  return (
    <div>
      <div>
        <input type="text" name="opacity" value={opacity[0]} readOnly hidden />
        <p className="text-sm">opacity</p>
        <div className="flex items-center gap-2">
          <div className="w-1/3">
            <input className="w-full" type="number" step={0.1} value={opacity[0]} onChange={handleOpacityChange} />
          </div>
          <div className="flex items-center w-full">
            <Slider min={0} max={1} step={0.1} value={opacity} onValueChange={setOpacity} />
          </div>
        </div>
      </div>
    </div>
  );
};
