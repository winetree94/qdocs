import { ReactElement } from 'react';
import { FadeEffect, OBJECT_EFFECT_META } from 'model/effect';
import { Slider } from 'components/slider';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { getEffectEntityKey } from 'store/effect/reducer';
import { EffectSelectors } from 'store/effect/selectors';
import { EffectActions } from '../../store/effect';
import { HistoryActions } from 'store/history';

export const EffectControllerFade = (): ReactElement => {
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
          type: OBJECT_EFFECT_META.FADE,
        }),
      ),
    ),
  ) as FadeEffect[];

  const [firstFadeEffect] = effectsOfSelectedObjects;

  const handleCurrentOpacityChange = (
    opacityValue: number | number[] | string,
  ): void => {
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

    dispatch(HistoryActions.Capture());
    dispatch(
      EffectActions.upsertEffects(
        effectsOfSelectedObjects.map((effect) => ({
          ...effect,
          prop: {
            ...effect.prop,
            opacity,
          },
        })),
      ),
    );
  };

  return (
    <div>
      <p className="tw-text-sm">fade</p>
      <div className="tw-flex tw-items-center tw-gap-2">
        <div className="tw-w-5/12">
          <input
            className="tw-w-full"
            type="number"
            step={0.1}
            value={firstFadeEffect.prop.opacity}
            onChange={(e): void => {
              handleCurrentOpacityChange(e.target.value);
            }}
          />
        </div>
        <div className="tw-flex tw-items-center tw-w-full">
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={[firstFadeEffect.prop.opacity]}
            onValueChange={(value): void => {
              handleCurrentOpacityChange(value);
            }}
          />
        </div>
      </div>
    </div>
  );
};
