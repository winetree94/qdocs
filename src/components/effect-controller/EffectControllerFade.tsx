import { ReactElement } from 'react';
import { QueueEffectType } from 'model/effect';
import { Slider } from 'components/slider';
import { ObjectQueueEffects, selectObjectQueueEffects } from 'store/legacy/selectors';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { objectsSlice } from 'store/object/object.reducer';
import { SettingSelectors } from 'store/settings/selectors';

export type EffectControllerFadeProps = {
  uuid: string;
  effectType: QueueEffectType['type'];
};

export const EffectControllerFade = (): ReactElement => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);
  const effects = useAppSelector(selectObjectQueueEffects(settings.queuePage, settings.queueIndex));

  const firstObjectRotateEffect = effects[settings.selectedObjectUUIDs[0]].fade;

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
      const nextEffect: ObjectQueueEffects['fade'] = {
        ...firstObjectRotateEffect,
        fade: {
          ...firstObjectRotateEffect.fade,
          opacity,
        },
      };

      dispatch(
        objectsSlice.actions.setObjectQueueEffects({
          page: settings.queuePage,
          queueIndex: settings.queueIndex,
          effects: {
            ...effects,
            [objectUUID]: {
              ...effects[objectUUID],
              fade: nextEffect,
            },
          },
        }),
      );
    });
  };

  return (
    <>
      <div>
        <input type="number" value={firstObjectRotateEffect.fade.opacity} hidden readOnly />
        <p className="text-sm">fade</p>
        <div className="flex items-center gap-2">
          <div className="w-5/12">
            <input
              className="w-full"
              type="number"
              name="fadeEffectOpacity"
              value={firstObjectRotateEffect.fade.opacity}
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
              value={[firstObjectRotateEffect.fade.opacity]}
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
