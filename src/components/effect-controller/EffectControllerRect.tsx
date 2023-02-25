import { MoveEffect } from 'model/effect';
import { QueueRect } from 'model/property';
import { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { effectSlice, getEffectEntityKey } from 'store/effect/reducer';
import { EffectSelectors } from 'store/effect/selectors';

export const EffectControllerRect = (): ReactElement => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);

  const firstObjectRectEffect = useAppSelector((state) =>
    EffectSelectors.byId(
      state,
      getEffectEntityKey({
        index: settings.queueIndex,
        objectId: settings.selectedObjectIds[0],
        type: 'rect',
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

      dispatch(
        effectSlice.actions.upsertEffect({
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
