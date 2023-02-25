import { ReactElement } from 'react';
import { FadeEffect } from 'model/effect';
import { Slider } from 'components/slider';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { effectSlice, getEffectEntityKey } from 'store/effect/reducer';
import { EffectSelectors } from 'store/effect/selectors';

export const EffectControllerFade = (): ReactElement => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);

  const firstObjectRotateEffect = useAppSelector((state) =>
    EffectSelectors.byId(
      state,
      getEffectEntityKey({
        index: settings.queueIndex,
        objectId: settings.selectedObjectUUIDs[0],
        type: 'fade',
      }),
    ),
  ) as FadeEffect;

  const handleCurrentOpacityChange = (opacityValue: number | number[] | string): void => {
    let opacity = 1;

    if (typeof opacityValue === 'number') {
      opacity = opacityValue;
    }

    if (Array.isArray(opacityValue)) {
      opacity = opacityValue[0];
    }

    if (typeof opacityValue === 'string') {
      opacity = parseFloat(opacityValue);
    }

    settings.selectedObjectUUIDs.forEach((objectUUID) => {
      const nextEffect = {
        ...firstObjectRotateEffect,
        prop: {
          ...firstObjectRotateEffect.prop,
          opacity,
        },
      };

      dispatch(
        effectSlice.actions.upsertEffect({
          ...nextEffect,
          objectId: objectUUID,
          index: settings.queueIndex,
          type: 'fade',
        }),
      );
    });
  };

  return (
    <>
      <div>
        <input type="number" value={firstObjectRotateEffect.prop.opacity} hidden readOnly />
        <p className="text-sm">fade</p>
        <div className="flex items-center gap-2">
          <div className="w-5/12">
            <input
              className="w-full"
              type="number"
              name="fadeEffectOpacity"
              value={firstObjectRotateEffect.prop.opacity}
              step={0.1}
              onChange={(e): void => {
                handleCurrentOpacityChange(e.target.value);
              }}
            />
          </div>
          <div className="flex items-center w-full">
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={[firstObjectRotateEffect.prop.opacity]}
              onValueChange={(value): void => {
                handleCurrentOpacityChange(value);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
