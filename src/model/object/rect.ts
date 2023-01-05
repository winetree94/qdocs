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

export interface QueueRectWithEffect extends QueueSquare {
  effects: (
    | CreateEffect
    | QueueSquareMoveEffect
    | QueueSquareStrokeEffect
    | QueueSquareFillEffect
    | QueueSquareTextEffect
    | RemoveEffect
  )[];
}

export function getRectOfIndex(
  object: QueueRectWithEffect,
  index: number
): QueueSquare | null {
  const createEffect = object.effects.find(
    (effect) => effect.type === 'create'
  )!;
  const removeEffect = object.effects.find(
    (effect) => effect.type === 'remove'
  );
  if (index < createEffect.index) {
    return null;
  }
  if (removeEffect && index > removeEffect.index) {
    return null;
  }
  const restEffects = object.effects.filter(
    (effect) => effect.type !== 'create' && effect.type !== 'remove'
  );
  return restEffects
    .filter((effect) => effect.index <= index)
    .reduce<QueueSquare>(
      (object, effect) => {
        switch (effect.type) {
          case 'move': {
            object.rect.x = effect.rect.x;
            object.rect.y = effect.rect.y;
            object.rect.width = effect.rect.width;
            object.rect.height = effect.rect.height;
            break;
          }
          case 'stroke': {
            object.stroke.dashArray = effect.stroke.dashArray;
            object.stroke.width = effect.stroke.width;
            object.stroke.color = effect.stroke.color;
            break;
          }
          case 'text': {
            object.text.text = effect.text.text;
            object.text.fontSize = effect.text.fontSize;
            object.text.fontFamily = effect.text.fontFamily;
            object.text.fontColor = effect.text.fontColor;
            object.text.verticalAlign = effect.text.verticalAlign;
            object.text.horizontalAlign = effect.text.horizontalAlign;
            break;
          }
        }
        return object;
      },
      {
        type: 'rect',
        uuid: object.uuid,
        rect: {
          x: object.rect.x,
          y: object.rect.y,
          width: object.rect.width,
          height: object.rect.height,
        },
        stroke: {
          dashArray: object.stroke.dashArray,
          width: object.stroke.width,
          color: object.stroke.color,
        },
        fill: {
          color: object.fill.color,
        },
        text: {
          text: object.text.text,
          fontSize: object.text.fontSize,
          fontFamily: object.text.fontFamily,
          fontColor: object.text.fontColor,
          verticalAlign: object.text.verticalAlign,
          horizontalAlign: object.text.horizontalAlign,
        },
      }
    );
}
