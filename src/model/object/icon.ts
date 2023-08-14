import { EntityId, nanoid } from '@reduxjs/toolkit';
import { QueueDocumentRect } from 'model/document';
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
  WithStroke,
  WithText,
} from 'model/property';

export interface QueueIcon
  extends WithRect,
    WithFade,
    WithFill,
    WithScale,
    WithRotation,
    WithStroke,
    WithText,
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
  type: 'icon';
  iconType: string;
  index: number;
  id: EntityId;
}

export const createDefaultIcon = (
  documentRect: QueueDocumentRect,
  queueIndex: number,
  iconType: string,
): QueueIcon => {
  const width = 300;
  const height = 300;
  const objectId = nanoid();
  return {
    type: 'icon',
    iconType: iconType,
    id: objectId,
    index: 0,
    rect: {
      x: documentRect.width / 2 - width / 2,
      y: documentRect.height / 2 - height / 2,
      width: width,
      height: height,
    },
    fill: {
      color: '#000000',
      opacity: 1,
    },
    rotate: {
      degree: 0,
    },
    scale: {
      scale: 1,
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
    stroke: {
      color: '#000000',
      dasharray: '',
      width: 0,
    },
    effects: [
      {
        id: nanoid(),
        type: 'create',
        timing: 'linear',
        objectId: objectId,
        duration: 0,
        delay: 0,
        index: queueIndex,
        prop: undefined,
      },
    ],
  };
};
