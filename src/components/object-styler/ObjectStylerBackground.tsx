import { EntityId } from '@reduxjs/toolkit';
import { Color } from 'components/object-styler/color/Color';
import { QueueSlider } from 'components/slider/Slider';
import { QueueObjectType } from 'model/object';
import { QueueFill } from 'model/property';
import { supportFillAll } from 'model/support';
import { ChangeEvent, ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';

/**
 * @todo
 * fill? background?
 */
export const ObjectStylerBackground = (): ReactElement => {
  const dispatch = useAppDispatch();

  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);

  if (!supportFillAll(selectedObjects)) {
    return <></>;
  }

  const [firstObject] = selectedObjects;

  const updateObjectFill = (fill: Partial<QueueFill>) => {
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.map<{
          id: EntityId;
          changes: Partial<QueueObjectType>;
        }>((object) => {
          return {
            id: object.id,
            changes: {
              fill: {
                ...object.fill,
                ...fill,
              },
            },
          };
        }),
      ),
    );
  };

  const handleFillColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateObjectFill({ color: e.target.value });
  };

  const handleOpacityChange = (
    opacityValue: number | number[] | string,
  ): void => {
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
      <div className="tw-mb-1">
        <p className="tw-font-medium">Background</p>
      </div>
      <div className="tw-flex tw-flex-col tw-gap-2">
        <div>
          <p className="tw-text-sm">color</p>
          <div className="tw-w-6 tw-h-6">
            <Color
              displayColor={firstObject.fill.color}
              onChange={handleFillColorChange}
            />
          </div>
        </div>
        <div>
          <input
            type="text"
            name="backgroundOpacity"
            value={firstObject.fill.opacity}
            readOnly
            hidden
          />
          <p className="tw-text-sm">opacity</p>
          <div className="tw-flex tw-items-center tw-gap-2">
            <div className="tw-w-1/3">
              <input
                className="tw-w-full"
                type="number"
                step={0.1}
                value={firstObject.fill.opacity}
                onChange={(e) => handleOpacityChange(e.target.value)}
              />
            </div>
            <div className="tw-flex tw-items-center tw-w-full">
              <QueueSlider
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
