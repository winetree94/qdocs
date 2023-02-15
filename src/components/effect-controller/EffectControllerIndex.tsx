import { EffectControllerRect } from 'components/effect-controller/EffectControllerRect';
import { QueueEffectType } from 'model/effect';
import { ReactElement } from 'react';

export type EffectControllerIndexProps = {
  effectType: QueueEffectType['type'];
};

export const EffectControllerIndex = ({
  effectType,
}: EffectControllerIndexProps): ReactElement | null => {
  switch (effectType) {
    case 'rotate':
      // return <EffectControllerRotate rotateEffect={effect} />;
      break;
    case 'fade':
      // return <EffectControllerFade effectType={effect.type} uuid={uuid} />;
      break;
    case 'rect':
      return <EffectControllerRect />;
    default:
      return null;
  }
};
