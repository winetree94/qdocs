import { EntityId, nanoid } from '@reduxjs/toolkit';
import { QueueDocumentRect } from '@legacy/model/document/document';
import { OBJECT_TYPE } from './meta';
import { BaseObject } from './base';
import {
  WithFade,
  WithFill,
  WithRect,
  WithRotation,
  WithScale,
  WithStroke,
  WithText,
} from '@legacy/model/property';
import { getRandomColor } from '@legacy/cdk/color/color';

export interface QueueCircle
  extends BaseObject,
    WithRect,
    WithFade,
    WithFill,
    WithRotation,
    WithScale,
    WithStroke,
    WithText {
  type: typeof OBJECT_TYPE.CIRCLE;
}

export const createDefaultCircle = (
  documentRect: QueueDocumentRect,
  pageId: EntityId,
): QueueCircle => {
  const width = 300;
  const height = 300;
  const objectId = nanoid();
  return {
    type: OBJECT_TYPE.CIRCLE,
    pageId: pageId,
    id: objectId,
    index: 0,
    uniqueColor: getRandomColor(),
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
  };
};
