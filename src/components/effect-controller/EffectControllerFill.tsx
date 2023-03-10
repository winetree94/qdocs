import { Slider } from 'components/slider';
import { FillEffect, OBJECT_EFFECT_META } from 'model/effect';
import { ChangeEvent, ReactElement } from 'react';
import { EffectActions, EffectSelectors, getEffectEntityKey } from 'store/effect';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings';

export const EffectControllerFill = (): ReactElement => {
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
          type: OBJECT_EFFECT_META.FILL,
        }),
      ),
    ),
  ) as FillEffect[];

  const [firstFillEffect] = effectsOfSelectedObjects;

  const updateSelectedObjectsEffect = (nextFillEffectProp: Partial<FillEffect['prop']>): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      EffectActions.upsertEffects(
        effectsOfSelectedObjects.map((effect) => ({
          ...effect,
          prop: {
            ...effect.prop,
            ...nextFillEffectProp,
          },
        })),
      ),
    );
  };

  const handleCurrentColorChange = (e: ChangeEvent<HTMLInputElement>): void => {
    updateSelectedObjectsEffect({
      color: e.target.value,
    });
  };

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

    updateSelectedObjectsEffect({ opacity });
  };

  return (
    <div>
      <p className="text-sm">color</p>
      <div>
        <input type="color" value={firstFillEffect.prop.color} onChange={handleCurrentColorChange} />
      </div>
      <p className="text-sm">opacity</p>
      <div className="flex items-center gap-2">
        <div className="w-5/12">
          <input
            className="w-full"
            type="number"
            step={0.1}
            value={firstFillEffect.prop.opacity}
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
            value={[firstFillEffect.prop.opacity]}
            onValueChange={(value): void => {
              handleCurrentOpacityChange(value);
            }}
          />
        </div>
      </div>
    </div>
  );
};
