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
  dashArray: string;
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
}

export interface QueueSquareMoveEffect extends BaseQueueEffect {
  type: 'move';
  rect: QueueSquareRect;
}

export interface QueueSquareStrokeEffect extends BaseQueueEffect {
  type: 'stroke';
  stroke: QueueSquareStroke;
}

export interface QueueSquareFillEffect extends BaseQueueEffect {
  type: 'fill';
  fill: QueueSquareFill;
}

export interface QueueSquareTextEffect extends BaseQueueEffect {
  type: 'text';
  text: QueueSquareText;
}

export interface QueueSquareFadeEffect extends BaseQueueEffect {
  type: 'fade';
  fade: QueueSquareFade;
}

export interface QueueSquareWithEffect extends QueueSquare {
  effects: (
    | CreateEffect
    | QueueSquareMoveEffect
    | QueueSquareStrokeEffect
    | QueueSquareFillEffect
    | QueueSquareTextEffect
    | QueueSquareFadeEffect
    | RemoveEffect
  )[];
}

export function getSumRect(
  object: QueueSquareWithEffect
): QueueSquareWithEffect {
  const sliced: QueueSquareWithEffect = { ...object };
  const moveEffect = object.effects
    // .filter((effect) => effect.index === index)
    .find((effect) => effect.type === 'move') as QueueSquareMoveEffect;
  if (!moveEffect) {
    return object;
  }
  sliced.rect = {
    ...moveEffect.rect,
  };
  return sliced;
}

export function isExistObjectOnQueue(
  object: QueueSquareWithEffect,
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
  if (removeEffect && index > removeEffect.index) {
    return false;
  }
  return true;
}
