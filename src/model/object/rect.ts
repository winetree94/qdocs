import {
  BaseObject,
  BaseQueueEffect,
  CreateEffect,
  RemoveEffect,
} from './object';

export interface QueueSquareRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface QueueSquareFill {
  color: string;
}

export interface QueueSquareFade {
  opacity: number;
}

export interface QueueSquareStroke {
  dasharray: string;
  width: number;
  color: string;
}

export interface QueueSquareText {
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
  rect: QueueSquareRect;
  fade: QueueSquareFade;
  fill: QueueSquareFill;
  stroke: QueueSquareStroke;
  text: QueueSquareText;
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
  rect: QueueSquareRect;
}

export interface StrokeEffect extends BaseQueueEffect {
  type: 'stroke';
  stroke: QueueSquareStroke;
}

export interface FillEffect extends BaseQueueEffect {
  type: 'fill';
  fill: QueueSquareFill;
}

export interface TextEffect extends BaseQueueEffect {
  type: 'text';
  text: QueueSquareText;
}

export interface FadeEffect extends BaseQueueEffect {
  type: 'fade';
  fade: QueueSquareFade;
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
