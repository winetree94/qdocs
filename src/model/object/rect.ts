import {
  BaseObject,
  BaseQueueEffect,
  CreateEffect,
  RemoveEffect,
} from './object';

export interface QueueRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface QueueFill {
  color: string;
}

export interface QueueFade {
  opacity: number;
}

export interface QueueStroke {
  dasharray: string;
  width: number;
  color: string;
}

export interface QueueRotate {
  x: number;
  y: number;
  position: 'forward' | 'reverse';
  degree: number;
}

export interface QueueScale {
  scale: number;
}

export interface QueueText {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  verticalAlign: 'top' | 'middle' | 'bottom';
  horizontalAlign: 'left' | 'center' | 'right';
}

export interface QueueSquare extends BaseObject {
  type: 'rect';
  uuid: string;
  rect: QueueRect;
  fade: QueueFade;
  fill: QueueFill;
  scale: QueueScale;
  rotate: QueueRotate;
  stroke: QueueStroke;
  text: QueueText;
  effects: (
    | CreateEffect
    | MoveEffect
    | StrokeEffect
    | FillEffect
    | TextEffect
    | FadeEffect
    | RemoveEffect
  )[];
}

export interface MoveEffect extends BaseQueueEffect {
  type: 'move';
  rect: QueueRect;
}

export interface StrokeEffect extends BaseQueueEffect {
  type: 'stroke';
  stroke: QueueStroke;
}

export interface FillEffect extends BaseQueueEffect {
  type: 'fill';
  fill: QueueFill;
}

export interface TextEffect extends BaseQueueEffect {
  type: 'text';
  text: QueueText;
}

export interface FadeEffect extends BaseQueueEffect {
  type: 'fade';
  fade: QueueFade;
}

export interface ScaleEffect extends BaseQueueEffect {
  type: 'scale';
  scale: QueueScale;
}

export interface RotateEffect extends BaseQueueEffect {
  type: 'rotate';
  rotate: QueueRotate;
}

export function isExistObjectOnQueue(
  object: QueueSquare,
  index: number
): boolean {
  const createEffect = object.effects.find(
    (effect) => effect.type === 'create'
  )!;
  const removeEffect = object.effects.find(
    (effect) => effect.type === 'remove'
  );
  if (index < createEffect.index) {
    return false;
  }
  if (removeEffect && index >= removeEffect.index) {
    return false;
  }
  return true;
}
