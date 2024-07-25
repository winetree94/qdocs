import { EffectControllerFade } from '@/legacy/app/panel-right/effect-panel/effect-controller/EffectControllerFade';
import { EffectControllerFill } from '@/legacy/app/panel-right/effect-panel/effect-controller/EffectControllerFill';
import { EffectControllerRect } from '@/legacy/app/panel-right/effect-panel/effect-controller/EffectControllerRect';
import { EffectControllerRotate } from '@/legacy/app/panel-right/effect-panel/effect-controller/EffectControllerRotate';
import { EffectControllerScale } from '@/legacy/app/panel-right/effect-panel/effect-controller/EffectControllerScale';
import { QueueEffectType } from '@legacy/model/effect';
import { OBJECT_PROPERTY_TYPE } from '@legacy/model/property';
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
