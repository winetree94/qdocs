import { EffectControllerFade } from 'components/effect-controller/EffectControllerFade';
import { EffectControllerRect } from 'components/effect-controller/EffectControllerRect';
import { EffectControllerRotate } from 'components/effect-controller/EffectControllerRotate';
import { QueueEffectType } from 'model/effect';
import { ReactElement } from 'react';

export type EffectControllerIndexProps = {
  uuid: string;
  effect: QueueEffectType;
};

export const EffectControllerIndex = ({
  uuid,
  effect,
}: EffectControllerIndexProps): ReactElement | null => {
  switch (effect.type) {
    case 'rotate':
      return <EffectControllerRotate rotateEffect={effect} />;
    case 'fade':
      return <EffectControllerFade effectType={effect.type} uuid={uuid} />;
    case 'rect':
      return <EffectControllerRect effectType={effect.type} uuid={uuid} />;
    default:
      return null;
  }
};
