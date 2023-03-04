import { EffectControllerFade } from 'components/effect-controller/EffectControllerFade';
import { EffectControllerRect } from 'components/effect-controller/EffectControllerRect';
import { EffectControllerRotate } from 'components/effect-controller/EffectControllerRotate';
import { EffectControllerScale } from 'components/effect-controller/EffectControllerScale';
import { QueueEffectType } from 'model/effect';
import { OBJECT_PROPERTY_META } from 'model/meta';
import { ReactElement } from 'react';

export type EffectControllerIndexProps = {
  effectType: QueueEffectType['type'];
};

export const EffectControllerIndex = ({ effectType }: EffectControllerIndexProps): ReactElement | null => {
  switch (effectType) {
    case OBJECT_PROPERTY_META.FADE:
      return <EffectControllerFade />;
    case OBJECT_PROPERTY_META.RECT:
      return <EffectControllerRect />;
    case OBJECT_PROPERTY_META.ROTATE:
      return <EffectControllerRotate />;
    case OBJECT_PROPERTY_META.SCALE:
      return <EffectControllerScale />;
    default:
      return null;
  }
};
