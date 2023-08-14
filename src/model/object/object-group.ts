import {
  WithEffects,
  FadeEffect,
  FillEffect,
  MoveEffect,
  RotateEffect,
  ScaleEffect,
  CreateEffect,
  RemoveEffect,
  StrokeEffect,
  TextEffect,
} from 'model/effect';
import {
  WithFade,
  WithFill,
  WithRect,
  WithRotation,
  WithScale,
  WithText,
} from 'model/property';
import { WithImage } from 'model/property/image';
import { EntityId } from '@reduxjs/toolkit';

export interface QueueObjectGroup
  extends WithRect,
    WithFade,
    WithFill,
    WithRotation,
    WithScale,
    WithText,
    WithImage,
    WithEffects<
      | CreateEffect
      | FadeEffect
      | FillEffect
      | MoveEffect
      | RemoveEffect
      | RotateEffect
      | StrokeEffect
      | ScaleEffect
      | TextEffect
    > {
  type: 'objectGroup';
  index: number;
  id: EntityId;
}
