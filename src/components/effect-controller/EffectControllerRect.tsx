import { useSettings } from 'cdk/hooks/useSettings';
import { QueueRect } from 'model/property';
import { ReactElement } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { objectCurrentRects } from 'store/effects/rect';
import { currentQueueObjects } from 'store/object';

export const EffectControllerRect = (): ReactElement => {
  const { settings } = useSettings();

  const selectedObjects = useRecoilValue(
    currentQueueObjects({
      pageIndex: settings.queuePage,
      queueIndex: settings.queueIndex,
    })
  ).filter((object) => settings.selectedObjectUUIDs.includes(object.uuid));

  const [objectRects, setObjectRects] = useRecoilState(
    objectCurrentRects({
      pageIndex: settings.queuePage,
      queueIndex: settings.queueIndex,
      uuid: settings.selectedObjectUUIDs,
    })
  );

  const [firstObject] = selectedObjects;
  const firstObjectRectEffect = objectRects[firstObject.uuid];

  const handleCurrentRectChange = (rect: Partial<QueueRect>): void => {
    const updateModel = settings.selectedObjectUUIDs.reduce<{
      [key: string]: QueueRect;
    }>((result, uuid) => {
      result[uuid] = {
        ...objectRects[uuid],
        ...rect,
      };
      return result;
    }, {});

    setObjectRects((prev) => ({
      ...prev,
      ...updateModel,
    }));
  };

  return (
    <div>
      <p className="text-sm">width</p>
      <div className="flex items-center gap-2">
        <input
          className="w-full"
          type="number"
          value={firstObjectRectEffect.width}
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
          value={firstObjectRectEffect.height}
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
          value={firstObjectRectEffect.x}
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
          value={firstObjectRectEffect.y}
          onChange={(e): void =>
            handleCurrentRectChange({ y: parseInt(e.currentTarget.value) })
          }
        />
      </div>
    </div>
  );
};
