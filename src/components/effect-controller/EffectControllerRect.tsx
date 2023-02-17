import { useSettings } from 'cdk/hooks/useSettings';
import { QueueRect } from 'model/property';
import { ReactElement } from 'react';
import { useRecoilState } from 'recoil';
import { ObjectQueueEffects, objectQueueEffects } from 'store/effects';

export const EffectControllerRect = (): ReactElement => {
  const { settings } = useSettings();

  const [effects, setEffects] = useRecoilState(
    objectQueueEffects({
      pageIndex: settings.queuePage,
      queueIndex: settings.queueIndex,
    })
  );

  const firstObjectRectEffect = effects[settings.selectedObjectUUIDs[0]].rect;

  const handleCurrentRectChange = (rect: Partial<QueueRect>): void => {
    const newEffects = settings.selectedObjectUUIDs.reduce<{
      [key: string]: ObjectQueueEffects;
    }>((result, uuid) => {
      result[uuid] = {
        rect: {
          ...effects[uuid].rect,
          rect: {
            ...effects[uuid].rect.rect,
            ...rect,
          },
        },
      };
      return result;
    }, {});

    setEffects(newEffects);
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
