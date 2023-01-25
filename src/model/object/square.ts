import { generateUUID } from 'cdk/functions/uuid';
import { QueueDocumentRect } from 'model/document';
import { WithEffects } from 'model/effect';
import { WithFade, WithFill, WithRect, WithRotation, WithScale, WithStroke, WithText } from 'model/property';
import { QueueObjectType } from '.';

export interface QueueSquare extends WithEffects, WithRect, WithFade, WithFill, WithScale, WithRotation, WithStroke, WithText {
  type: 'rect';
  uuid: string;
}

export function isExistObjectOnQueue(
  object: QueueObjectType,
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

export const createDefaultSquare = (
  documentRect: QueueDocumentRect,
  queueIndex: number,
): QueueSquare => {
  const width = 300;
  const height = 300;
  return {
    type: 'rect',
    uuid: generateUUID(),
    rect: {
      x: documentRect.width / 2 - width / 2,
      y: documentRect.height / 2 - height / 2,
      width: width,
      height: height,
    },
    stroke: {
      width: 1,
      color: '#000000',
      dasharray: 'solid',
    },
    fill: {
      color: '#ffffff',
      opacity: 1,
    },
    scale: {
      scale: 1,
    },
    rotate: {
      x: 0,
      y: 0,
      position: 'forward',
      degree: 0,
    },
    fade: {
      opacity: 1,
    },
    text: {
      text: '',
      fontSize: 24,
      fontColor: '#000000',
      fontFamily: 'Arial',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
    },
    effects: [
      {
        type: 'create',
        timing: 'linear',
        duration: 0,
        index: queueIndex,
      },
    ],
  };
};