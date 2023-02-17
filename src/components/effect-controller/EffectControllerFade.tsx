import { useSettings } from 'cdk/hooks/useSettings';
import { Slider } from 'components/slider';
import { QueueEffectType } from 'model/effect';
import { QueueFade } from 'model/property';
import { ReactElement } from 'react';
import { useRecoilState } from 'recoil';
import { ObjectQueueEffects, objectQueueEffects } from 'store/effects';

export type EffectControllerFadeProps = {
  uuid: string;
  effectType: QueueEffectType['type'];
};

export const EffectControllerFade = ({
  uuid,
  effectType,
}: EffectControllerFadeProps): ReactElement => {
  const { settings } = useSettings();

  const [effects, setEffects] = useRecoilState(objectQueueEffects({
    pageIndex: settings.queuePage,
    queueIndex: settings.queueIndex,
  }));

  const firstObjectFadeEffect = effects[settings.selectedObjectUUIDs[0]].fade;
  const fade = firstObjectFadeEffect.fade;

  const handleCurrentFadeChange = (fade: Partial<QueueFade>): void => {
    const newUpdateModel = settings.selectedObjectUUIDs.reduce<{
      [key: string]: ObjectQueueEffects;
    }>((result, uuid) => {
      result[uuid] = {
        ...effects[uuid],
        fade: {
          ...effects[uuid].fade,
          ...fade,
        },
      };
      return result;
    }, {});

    setEffects({
      ...effects,
      ...newUpdateModel,
    });
  };

  return (
    <>
      <div>
        <input
          type="number"
          name="fadeEffectOpacity"
          value={fade.opacity}
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
              value={fade.opacity}
              step={0.1}
              onChange={(e): void => {
                handleCurrentFadeChange({ opacity: parseFloat(e.currentTarget.value) });
              }}
            />
          </div>
          <div className="flex items-center w-full">
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={[fade.opacity]}
              onValueChange={([value]): void => {
                handleCurrentFadeChange({ opacity: value });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
