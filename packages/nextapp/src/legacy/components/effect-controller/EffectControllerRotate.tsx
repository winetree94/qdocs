import { OBJECT_EFFECT_TYPE, RotateEffect } from '@legacy/model/effect';
import { QueueRotate } from '@legacy/model/property';
import { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { SettingSelectors } from '@legacy/store/settings/selectors';
import { getEffectEntityKey } from '@legacy/store/effect/reducer';
import { EffectSelectors } from '@legacy/store/effect/selectors';
import { EffectActions } from '../../store/effect';
import { HistoryActions } from '@legacy/store/history';
import { useTranslation } from 'react-i18next';

export const EffectControllerRotate = (): ReactElement => {
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
          type: OBJECT_EFFECT_TYPE.ROTATE,
        }),
      ),
    ),
  ) as RotateEffect[];

  const [firstRotateEffect] = effectsOfSelectedObjects;

  const handleCurrentRotateChange = (rotate: QueueRotate): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      EffectActions.upsertEffects(
        effectsOfSelectedObjects.map((effect) => ({
          ...effect,
          prop: {
            ...effect.prop,
            ...rotate,
          },
        })),
      ),
    );
  };

  return (
    <div>
      <p className="tw-text-sm">{t('global.rotation')}</p>
      <div className="tw-flex tw-items-center tw-gap-2">
        <input
          className="tw-w-full"
          type="number"
          step={5}
          value={firstRotateEffect.prop.degree}
          onChange={(e): void => {
            handleCurrentRotateChange({ degree: parseInt(e.target.value) });
          }}
        />
      </div>
    </div>
  );
};
