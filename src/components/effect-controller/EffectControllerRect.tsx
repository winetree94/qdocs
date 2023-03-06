import { MoveEffect, OBJECT_EFFECT_META } from 'model/effect';
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
  const settings = useAppSelector(SettingSelectors.settings);

  const firstObjectRectEffect = useAppSelector((state) =>
    EffectSelectors.byId(
      state,
      getEffectEntityKey({
        index: settings.queueIndex,
        objectId: settings.selectedObjectIds[0],
        type: OBJECT_EFFECT_META.RECT,
      }),
    ),
  ) as MoveEffect;

  const handleCurrentRectChange = (rect: Partial<QueueRect>): void => {
    settings.selectedObjectIds.forEach((objectId) => {
      const nextEffect: MoveEffect = {
        ...firstObjectRectEffect,
        index: settings.queueIndex,
        prop: {
          ...firstObjectRectEffect.prop,
          ...rect,
        },
      };

      dispatch(HistoryActions.Capture());
      dispatch(
        EffectActions.upsertEffect({
          ...nextEffect,
          objectId: objectId,
          index: settings.queueIndex,
        }),
      );
    });
  };

  return (
    <div>
      <p className="text-sm">width</p>
      <div className="flex items-center gap-2">
        <input
          className="w-full"
          type="number"
          value={firstObjectRectEffect.prop.width}
          onChange={(e): void => handleCurrentRectChange({ width: parseInt(e.currentTarget.value) })}
        />
      </div>
      <p className="text-sm">height</p>
      <div className="flex items-center gap-2">
        <input
          className="w-full"
          type="number"
          value={firstObjectRectEffect.prop.height}
          onChange={(e): void => handleCurrentRectChange({ height: parseInt(e.currentTarget.value) })}
        />
      </div>
      <p className="text-sm">x</p>
      <div className="flex items-center gap-2">
        <input
          className="w-full"
          type="number"
          value={firstObjectRectEffect.prop.x}
          onChange={(e): void => handleCurrentRectChange({ x: parseInt(e.currentTarget.value) })}
        />
      </div>
      <p className="text-sm">y</p>
      <div className="flex items-center gap-2">
        <input
          className="w-full"
          type="number"
          value={firstObjectRectEffect.prop.y}
          onChange={(e): void => handleCurrentRectChange({ y: parseInt(e.currentTarget.value) })}
        />
      </div>
    </div>
  );
};
