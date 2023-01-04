import {
  BaseObject,
  BaseQueueEffect,
  CreateEffect,
  RemoveEffect,
} from './object';

export interface QueueRect extends BaseObject {
  type: 'rect';
  uuid: string;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface QueueRectMoveEffect extends BaseQueueEffect {
  type: 'move';
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface QueueRectWithEffect extends QueueRect {
  effects: (CreateEffect | QueueRectMoveEffect | RemoveEffect)[];
}

export function getRectOfIndex(
  object: QueueRectWithEffect,
  index: number
): QueueRect | null {
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
    .reduce<QueueRect>(
      (object, effect) => {
        switch (effect.type) {
          case 'move': {
            object.rect.x = effect.rect.x;
            object.rect.y = effect.rect.y;
            object.rect.width = effect.rect.width;
            object.rect.height = effect.rect.height;
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
      }
    );
}
