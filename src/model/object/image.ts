import { EntityId, nanoid } from '@reduxjs/toolkit';
import { QueueDocumentRect } from 'model/document';
import { WithEffects } from 'model/effect';
import { WithRect, WithFade, WithFill, WithRotation, WithScale, WithStroke, WithText } from 'model/property';
import { WithImage } from 'model/property/image';

export interface QueueImage
  extends WithEffects,
    WithRect,
    WithFade,
    WithFill,
    WithRotation,
    WithScale,
    WithStroke,
    WithText,
    WithImage {
  type: 'image';
  index: number;
  id: EntityId;
}

export const createDefaultImage = (
  documentRect: QueueDocumentRect,
  queueIndex: number,
  objectId: string,
  // assetId: string,
): QueueImage => {
  const width = 300;
  const height = 300;

  return {
    type: 'image',
    id: objectId,
    index: 0,
    rect: {
      x: documentRect.width / 2 - width / 2,
      y: documentRect.height / 2 - height / 2,
      width,
      height,
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
    stroke: {
      color: '#000000',
      dasharray: '',
      width: 0,
    },
    image: {
      assetId: '',
      src: '',
      alt: '',
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
