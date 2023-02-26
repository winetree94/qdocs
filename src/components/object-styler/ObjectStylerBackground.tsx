import { EntityId } from '@reduxjs/toolkit';
import { Color } from 'components/object-styler/color/Color';
import { Slider } from 'components/slider';
import { QueueFill } from 'model/property';
import { ChangeEvent, ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { NormalizedQueueObjectType, ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';

/**
 * @todo
 * fill? background?
 */
export const ObjectStylerBackground = (): ReactElement => {
  const dispatch = useAppDispatch();

  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const [firstObject] = selectedObjects;

  const updateObjectFill = (fill: Partial<QueueFill>) => {
    const updateModels = selectedObjects.map<{ id: EntityId; changes: Partial<NormalizedQueueObjectType> }>(
      (object) => {
        return {
          id: object.id,
          changes: {
            fill: {
              ...object.fill,
              ...fill,
            },
          },
        };
      },
    );

    dispatch(ObjectActions.updateObjects(updateModels));
  };

  const handleFillColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateObjectFill({ color: e.target.value });
  };

  const handleOpacityChange = (opacityValue: number | number[] | string): void => {
    let opacity = 0;

    if (typeof opacityValue === 'number') {
      opacity = opacityValue;
    }

    if (Array.isArray(opacityValue)) {
      opacity = opacityValue[0];
    }

    if (typeof opacityValue === 'string') {
      opacity = parseFloat(opacityValue);
    }

    updateObjectFill({ opacity });
  };

  return (
    <div>
      <div className="mb-1">
        <p className="font-medium">Background</p>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm">color</p>
          <div className="w-6 h-6">
            <Color displayColor={firstObject.fill.color} onChange={handleFillColorChange} />
          </div>
        </div>
        <div>
          <input type="text" name="backgroundOpacity" value={firstObject.fill.opacity} readOnly hidden />
          <p className="text-sm">opacity</p>
          <div className="flex items-center gap-2">
            <div className="w-1/3">
              <input
                className="w-full"
                type="number"
                step={0.1}
                value={firstObject.fill.opacity}
                onChange={(e) => handleOpacityChange(e.target.value)}
              />
            </div>
            <div className="flex items-center w-full">
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[firstObject.fill.opacity]}
                onValueChange={handleOpacityChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
