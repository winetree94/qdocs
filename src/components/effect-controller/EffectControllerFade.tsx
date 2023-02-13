import { useQueueDocument } from 'cdk/hooks/useQueueDocument';
import { useSettings } from 'cdk/hooks/useSettings';
import { Slider } from 'components/slider';
import { QueueEffectType } from 'model/effect';
import { ReactElement, useState } from 'react';

export type EffectControllerFadeProps = {
  uuid: string;
  effectType: QueueEffectType['type'];
};

export const EffectControllerFade = ({
  uuid,
  effectType,
}: EffectControllerFadeProps): ReactElement => {
  const { settings } = useSettings();
  const { queueDocument, selectedObjects, ...setQueueDocument } =
    useQueueDocument();
  const [firstObject] = selectedObjects;
  const firstObjectCurrentEffect = firstObject.effects.find(
    (firstObjectEffect) =>
      firstObjectEffect.type === effectType &&
      firstObjectEffect.index === settings.queueIndex
  );
  const [fadeEffectOpacity, setFadeEffectOpacity] = useState(
    firstObjectCurrentEffect.type === 'fade'
      ? firstObjectCurrentEffect.fade.opacity
      : firstObject.fade.opacity
  );

  const updateCurrentOpacity = (opacity: number): void => {
    setFadeEffectOpacity(opacity);

    if (firstObjectCurrentEffect.type !== 'fade') {
      return;
    }

    if (firstObjectCurrentEffect.fade.opacity === opacity) {
      return;
    }

    setQueueDocument.updateObjectProp(settings.queuePage, [
      {
        uuid,
        queueIndex: settings.queueIndex,
        props: {
          fade: {
            fade: {
              opacity,
            },
          },
        },
      },
    ]);
  };

  return (
    <>
      <div>
        <input
          type="number"
          name="fadeEffectOpacity"
          value={fadeEffectOpacity}
          hidden
          readOnly
        />
        <p className="text-sm">fade</p>
        <div className="flex items-center gap-2">
          <div className="w-5/12">
            <input
              className="w-full"
              type="number"
              name="fadeEffectOpacity"
              value={fadeEffectOpacity}
              step={0.1}
              onChange={(e): void => {
                updateCurrentOpacity(parseFloat(e.currentTarget.value));
              }}
            />
          </div>
          <div className="flex items-center w-full">
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={[fadeEffectOpacity]}
              onValueChange={([value]): void => {
                updateCurrentOpacity(value);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
