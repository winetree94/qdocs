import { MoveEffect } from 'model/effect';
import { QueueRect } from 'model/property';
import { ReactElement } from 'react';
import { selectObjectQueueEffects } from 'store/legacy/selectors';
import { useAppDispatch, useAppSelector } from 'store/hooks';
// import { objectsSlice } from 'store/object/object.reducer';
import { SettingSelectors } from 'store/settings/selectors';
import { effectSlice } from 'store/effect/reducer';

export const EffectControllerRect = (): ReactElement => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);
  const effects = useAppSelector(selectObjectQueueEffects(settings.queuePage, settings.queueIndex));

  const firstObjectRectEffect = effects[settings.selectedObjectUUIDs[0]].rect;

  const handleCurrentRectChange = (rect: Partial<QueueRect>): void => {
    settings.selectedObjectUUIDs.forEach((objectUUID) => {
      const nextEffect: MoveEffect = {
        ...effects[objectUUID].rect,
        index: settings.queueIndex,
        prop: {
          ...effects[objectUUID].rect.prop,
          ...rect,
        },
      };

      dispatch(
        effectSlice.actions.upsertEffect({
          ...nextEffect,
          objectId: objectUUID,
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
