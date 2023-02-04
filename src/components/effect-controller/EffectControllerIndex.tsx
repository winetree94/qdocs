import { EffectControllerFade } from 'components/effect-controller/EffectControllerFade';
import { EffectControllerRotate } from 'components/effect-controller/EffectControllerRotate';
import { QueueEffectType } from 'model/effect';
import { ReactElement } from 'react';

export type EffectControllerIndexProps = {
  effect: QueueEffectType;
};

export const EffectControllerIndex = ({
  effect,
}: EffectControllerIndexProps): ReactElement | null => {
  switch (effect.type) {
    case 'rotate':
      return <EffectControllerRotate rotateEffect={effect} />;
    case 'fade':
      return <EffectControllerFade fadeEffect={effect} />;
    default:
      return null;
  }
};
