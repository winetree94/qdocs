import { Slider } from 'components/slider';
import { OBJECT_EFFECT_META, ScaleEffect } from 'model/effect';
import { ReactElement } from 'react';
import { EffectActions, EffectSelectors, getEffectEntityKey } from 'store/effect';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings';

export const EffectControllerScale = (): ReactElement => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  // need remove type assertion (?)
  const effectsOfSelectedObjects = useAppSelector((state) =>
    EffectSelectors.byIds(
      state,
      selectedObjects.map((object) =>
        getEffectEntityKey({
          index: settings.queueIndex,
          objectId: object.id,
          type: OBJECT_EFFECT_META.SCALE,
        }),
      ),
    ),
  ) as ScaleEffect[];

  const [firstScaleEffect] = effectsOfSelectedObjects;

  const handleCurrentScaleChange = (scaleValue: number | number[] | string): void => {
    let scale = 1;

    if (typeof scaleValue === 'number') {
      scale = scaleValue;
    }

    if (Array.isArray(scaleValue)) {
      scale = scaleValue[0];
    }

    if (typeof scaleValue === 'string') {
      scale = parseFloat(scaleValue);
    }

    dispatch(HistoryActions.Capture());
    dispatch(
      EffectActions.upsertEffects(
        effectsOfSelectedObjects.map((effect) => ({
          ...effect,
          prop: {
            ...effect.prop,
            scale,
          },
        })),
      ),
    );
  };

  return (
    <div>
      <input type="number" value={firstScaleEffect.prop.scale} hidden readOnly />
      <p className="text-sm">scale</p>
      <div className="flex items-center gap-2">
        <div className="w-5/12">
          <input
            className="w-full"
            type="number"
            value={firstScaleEffect.prop.scale}
            step={0.1}
            onChange={(e): void => {
              handleCurrentScaleChange(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center w-full">
          <Slider
            min={0.1}
            max={10}
            step={0.1}
            value={[firstScaleEffect.prop.scale]}
            onValueChange={(value): void => {
              handleCurrentScaleChange(value);
            }}
          />
        </div>
      </div>
    </div>
  );
};
