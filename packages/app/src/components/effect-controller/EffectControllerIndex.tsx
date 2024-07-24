import { EffectControllerFade } from 'components/effect-controller/EffectControllerFade';
import { EffectControllerFill } from 'components/effect-controller/EffectControllerFill';
import { EffectControllerRect } from 'components/effect-controller/EffectControllerRect';
import { EffectControllerRotate } from 'components/effect-controller/EffectControllerRotate';
import { EffectControllerScale } from 'components/effect-controller/EffectControllerScale';
import { QueueEffectType } from 'model/effect';
import { OBJECT_PROPERTY_TYPE } from 'model/property';
import { ReactElement } from 'react';

export type EffectControllerIndexProps = {
  effectType: QueueEffectType['type'];
};

export const EffectControllerIndex = ({
  effectType,
}: EffectControllerIndexProps): ReactElement | null => {
  switch (effectType) {
    case OBJECT_PROPERTY_TYPE.FADE:
      return <EffectControllerFade />;
    case OBJECT_PROPERTY_TYPE.FILL:
      return <EffectControllerFill />;
    case OBJECT_PROPERTY_TYPE.RECT:
      return <EffectControllerRect />;
    case OBJECT_PROPERTY_TYPE.ROTATE:
      return <EffectControllerRotate />;
    case OBJECT_PROPERTY_TYPE.SCALE:
      return <EffectControllerScale />;
    default:
      return null;
  }
};
