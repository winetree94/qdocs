import { RectEffect, OBJECT_EFFECT_TYPE } from '@legacy/model/effect';
import { QueueRect } from '@legacy/model/property';
import { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { SettingSelectors } from '@legacy/store/settings/selectors';
import { getEffectEntityKey } from '@legacy/store/effect/reducer';
import { EffectSelectors } from '@legacy/store/effect/selectors';
import { EffectActions } from '../../../../store/effect';
import { HistoryActions } from '@legacy/store/history';
import { useTranslation } from 'react-i18next';

export const EffectControllerRect = (): ReactElement => {
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
          type: OBJECT_EFFECT_TYPE.RECT,
        }),
      ),
    ),
  ) as RectEffect[];

  const [firstMoveEffect] = effectsOfSelectedObjects;

  const handleCurrentRectChange = (rect: Partial<QueueRect>): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      EffectActions.upsertEffects(
        effectsOfSelectedObjects.map((effect) => ({
          ...effect,
          prop: {
            ...effect.prop,
            ...rect,
          },
        })),
      ),
    );
  };

  return (
    <div>
      <p className="tw-text-sm">{t('global.width')}</p>
      <div className="tw-flex tw-items-center tw-gap-2">
        <input
          className="tw-w-full"
          type="number"
          value={firstMoveEffect.prop.width}
          onChange={(e): void =>
            handleCurrentRectChange({ width: parseInt(e.currentTarget.value) })
          }
        />
      </div>
      <p className="tw-text-sm">{t('global.height')}</p>
      <div className="tw-flex tw-items-center tw-gap-2">
        <input
          className="tw-w-full"
          type="number"
          value={firstMoveEffect.prop.height}
          onChange={(e): void =>
            handleCurrentRectChange({ height: parseInt(e.currentTarget.value) })
          }
        />
      </div>
      <p className="tw-text-sm">{t('global.x')}</p>
      <div className="tw-flex tw-items-center tw-gap-2">
        <input
          className="tw-w-full"
          type="number"
          value={firstMoveEffect.prop.x}
          onChange={(e): void =>
            handleCurrentRectChange({ x: parseInt(e.currentTarget.value) })
          }
        />
      </div>
      <p className="tw-text-sm">{t('global.y')}</p>
      <div className="tw-flex tw-items-center tw-gap-2">
        <input
          className="tw-w-full"
          type="number"
          value={firstMoveEffect.prop.y}
          onChange={(e): void =>
            handleCurrentRectChange({ y: parseInt(e.currentTarget.value) })
          }
        />
      </div>
    </div>
  );
};
