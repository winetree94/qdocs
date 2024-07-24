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

export interface QueueIcon
  extends BaseObject,
    WithRect,
    WithFade,
    WithFill,
    WithScale,
    WithRotation,
    WithStroke,
    WithText {
  type: typeof OBJECT_TYPE.ICON;
  iconType: string;
}

export const createDefaultIcon = (
  documentRect: QueueDocumentRect,
  pageId: EntityId,
  iconType: string,
): QueueIcon => {
  const width = 300;
  const height = 300;
  const objectId = nanoid();
  return {
    type: OBJECT_TYPE.ICON,
    iconType: iconType,
    id: objectId,
    pageId: pageId,
    index: 0,
    uniqueColor: getRandomColor(),
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
  };
};
