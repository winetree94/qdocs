import { MoveEffect } from 'model/effect';
import { QueueRect } from 'model/property';
import { ReactElement } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { objectQueueEffects } from 'store/effects';
import { documentSettingsState } from 'store/settings';

export const EffectControllerRect = (): ReactElement => {
  const settings = useRecoilValue(documentSettingsState);

  const [effects, setEffects] = useRecoilState(
    objectQueueEffects({
      pageIndex: settings.queuePage,
      queueIndex: settings.queueIndex,
    })
  );

  const firstObjectRectEffect = effects[settings.selectedObjectUUIDs[0]].rect;

  const handleCurrentRectChange = (rect: Partial<QueueRect>): void => {
    settings.selectedObjectUUIDs.forEach((objectUUID) => {
      const nextEffect: MoveEffect = {
        ...effects[objectUUID].rect,
        index: settings.queueIndex,
        rect: {
          ...effects[objectUUID].rect.rect,
          ...rect,
        },
      };

      setEffects((prevEffects) => ({
        ...prevEffects,
        [objectUUID]: {
          ...prevEffects[objectUUID],
          rect: nextEffect,
        },
      }));
    });
  };

  return (
    <div>
      <p className="text-sm">width</p>
      <div className="flex items-center gap-2">
        <input
          className="w-full"
          type="number"
          value={firstObjectRectEffect.rect.width}
          onChange={(e): void =>
            handleCurrentRectChange({ width: parseInt(e.currentTarget.value) })
          }
        />
      </div>
      <p className="text-sm">height</p>
      <div className="flex items-center gap-2">
        <input
          className="w-full"
          type="number"
          value={firstObjectRectEffect.rect.height}
          onChange={(e): void =>
            handleCurrentRectChange({ height: parseInt(e.currentTarget.value) })
          }
        />
      </div>
      <p className="text-sm">x</p>
      <div className="flex items-center gap-2">
        <input
          className="w-full"
          type="number"
          value={firstObjectRectEffect.rect.x}
          onChange={(e): void =>
            handleCurrentRectChange({ x: parseInt(e.currentTarget.value) })
          }
        />
      </div>
      <p className="text-sm">y</p>
      <div className="flex items-center gap-2">
        <input
          className="w-full"
          type="number"
          value={firstObjectRectEffect.rect.y}
          onChange={(e): void =>
            handleCurrentRectChange({ y: parseInt(e.currentTarget.value) })
          }
        />
      </div>
    </div>
  );
};
