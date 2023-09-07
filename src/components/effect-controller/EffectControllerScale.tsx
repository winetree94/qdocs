import { QueueSlider } from 'components/slider/Slider';
import { OBJECT_EFFECT_TYPE, ScaleEffect } from 'model/effect';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EffectActions,
  EffectSelectors,
  getEffectEntityKey,
} from 'store/effect';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings';

export const EffectControllerScale = (): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentQueueIndex = useAppSelector(SettingSelectors.queueIndex);
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  // need remove type assertion (?)
  const effectsOfSelectedObjects = useAppSelector((state) =>
    EffectSelectors.byIds(
      state,
      selectedObjects.map((object) =>
        getEffectEntityKey({
          index: currentQueueIndex,
          objectId: object.id,
          type: OBJECT_EFFECT_TYPE.SCALE,
        }),
      ),
    ),
  ) as ScaleEffect[];

  const [firstScaleEffect] = effectsOfSelectedObjects;

  const handleCurrentScaleChange = (
    scaleValue: number | number[] | string,
  ): void => {
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
      <input
        type="number"
        value={firstScaleEffect.prop.scale}
        hidden
        readOnly
      />
      <p className="tw-text-sm">{t('global.scale')}</p>
      <div className="tw-flex tw-items-center tw-gap-2">
        <div className="tw-w-5/12">
          <input
            className="tw-w-full"
            type="number"
            value={firstScaleEffect.prop.scale}
            step={0.1}
            onChange={(e): void => {
              handleCurrentScaleChange(e.target.value);
            }}
          />
        </div>
        <div className="tw-flex tw-items-center tw-w-full">
          <QueueSlider
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
