import { NormalizedQueueEffect } from 'store/effect';
import { NormalizedQueueObjectType } from 'store/object';
import { QUEUE_CLIPBOARD_UNIQUE_ID } from './constants';

export interface QueueClipboardModel<T> {
  type: string;
  identity: typeof QUEUE_CLIPBOARD_UNIQUE_ID;
  data: T;
}

export interface QueueObjectClipboardModel
  extends QueueClipboardModel<
    {
      object: NormalizedQueueObjectType;
      effects: NormalizedQueueEffect[];
    }[]
  > {
  type: 'objects';
  identity: typeof QUEUE_CLIPBOARD_UNIQUE_ID;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isQueueObjectClipboardModel = (model: any): model is QueueObjectClipboardModel => {
  return model?.type === 'objects' && model?.identity === QUEUE_CLIPBOARD_UNIQUE_ID;
};
