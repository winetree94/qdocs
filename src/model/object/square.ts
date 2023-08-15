import { QueueDocumentRect } from 'model/document/document';
import {
  WithFade,
  WithFill,
  WithRect,
  WithRotation,
  WithScale,
  WithStroke,
  WithText,
} from 'model/property';
import { EntityId, nanoid } from '@reduxjs/toolkit';
import { OBJECT_TYPE } from './meta';
import { BaseObject } from './base';

export interface QueueSquare
  extends BaseObject,
    WithRect,
    WithFade,
    WithFill,
    WithRotation,
    WithScale,
    WithStroke,
    WithText {
  type: typeof OBJECT_TYPE.RECT;
}

export const createDefaultSquare = (
  documentRect: QueueDocumentRect,
  pageId: EntityId,
): QueueSquare => {
  const width = 300;
  const height = 300;
  const objectId = nanoid();
  return {
    type: OBJECT_TYPE.RECT,
    id: objectId,
    pageId: pageId,
    index: 0,
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
