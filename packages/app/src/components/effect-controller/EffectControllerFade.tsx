import { ReactElement } from 'react';
import { FadeEffect, OBJECT_EFFECT_TYPE } from '@legacy/model/effect';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { SettingSelectors } from '@legacy/store/settings/selectors';
import { getEffectEntityKey } from '@legacy/store/effect/reducer';
import { EffectSelectors } from '@legacy/store/effect/selectors';
import { EffectActions } from '../../store/effect';
import { HistoryActions } from '@legacy/store/history';
import { QueueSlider } from '@legacy/components/slider/Slider';
import { useTranslation } from 'react-i18next';

export const EffectControllerFade = (): ReactElement => {
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
          type: OBJECT_EFFECT_TYPE.FADE,
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
      <p className="tw-text-sm">{t('effect.fade')}</p>
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
          <QueueSlider
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
