import { RectEffect, OBJECT_EFFECT_TYPE } from 'model/effect';
import { QueueRect } from 'model/property';
import { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { getEffectEntityKey } from 'store/effect/reducer';
import { EffectSelectors } from 'store/effect/selectors';
import { EffectActions } from '../../store/effect';
import { HistoryActions } from 'store/history';

export const EffectControllerRect = (): ReactElement => {
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
      <p className="tw-text-sm">width</p>
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
      <p className="tw-text-sm">height</p>
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
      <p className="tw-text-sm">x</p>
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
      <p className="tw-text-sm">y</p>
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
