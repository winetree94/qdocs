import { useQueueDocument } from 'cdk/hooks/useQueueDocument';
import { useSettings } from 'cdk/hooks/useSettings';
import { MoveEffect, QueueEffectType } from 'model/effect';
import { QueueRect } from 'model/property';
import { ReactElement, useCallback, useEffect, useState } from 'react';

export const EffectControllerRect = ({
  uuid,
  effectType,
}: {
  uuid: string;
  effectType: QueueEffectType['type'];
}): ReactElement => {
  const { settings } = useSettings();
  const { queueDocument, selectedObjects, ...setQueueDocument } =
    useQueueDocument();
  const [firstObject] = selectedObjects;
  const firstObjectCurrentEffect = firstObject.effects.find(
    (firstObjectEffect): firstObjectEffect is MoveEffect =>
      firstObjectEffect.type === 'rect' &&
      firstObjectEffect.index === settings.queueIndex
  );
  const [currentRect, setCurrentRect] = useState(firstObjectCurrentEffect.rect);

  const handleCurrentRectChange = useCallback(
    (rect: Partial<QueueRect>): void => {
      setCurrentRect({
        ...currentRect,
        ...rect,
      });
    },
    [currentRect]
  );

  const update = useCallback(
    (rect: QueueRect) => {
      setQueueDocument.updateObjectProp(settings.queuePage, [
        {
          uuid,
          queueIndex: settings.queueIndex,
          props: {
            rect: {
              rect,
            },
          },
        },
      ]);
    },
    [setQueueDocument, settings.queuePage, settings.queueIndex, uuid]
  );

  useEffect(() => {
    if (
      currentRect.width !== firstObjectCurrentEffect.rect.width ||
      currentRect.height !== firstObjectCurrentEffect.rect.height ||
      currentRect.x !== firstObjectCurrentEffect.rect.x ||
      currentRect.y !== firstObjectCurrentEffect.rect.y
    ) {
      // update(currentRect);
      handleCurrentRectChange(firstObjectCurrentEffect.rect);
    }
  }, [
    handleCurrentRectChange,
    queueDocument,
    firstObjectCurrentEffect.rect,
    // firstObjectCurrentEffect.rect.width,
    // firstObjectCurrentEffect.rect.height,
    // firstObjectCurrentEffect.rect.x,
    // firstObjectCurrentEffect.rect.y,
    currentRect,
    update,
  ]);

  return (
    <div>
      <p className="text-sm">width</p>
      <div className="flex items-center gap-2">
        <input
          className="w-full"
          type="number"
          value={currentRect.width}
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
          value={currentRect.height}
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
          value={currentRect.x}
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
          value={currentRect.y}
          onChange={(e): void =>
            handleCurrentRectChange({ y: parseInt(e.currentTarget.value) })
          }
        />
      </div>
    </div>
  );
};
