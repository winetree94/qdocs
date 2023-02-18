/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueueDocument } from 'model/document';
import {
  QueueObjectType,
} from 'model/object';
import { QueueRect, QueueRotate } from 'model/property';
import { useRecoilState } from 'recoil';
import { documentState } from 'store/document';
import { useSettings } from './useSettings';

export interface UseQueueDocument {
  readonly queueDocument: QueueDocument;
  changeObjectIndex: (
    fromUUIDs: string[],
    to: 'start' | 'end' | 'forward' | 'backward'
  ) => void;
}

/**
 * todo
 * update temporary visible prop
 * @deprecated
 */
export const useQueueDocument = (): UseQueueDocument => {
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const { settings } = useSettings();

  const changeObjectIndex = (
    fromUUIDs: string[],
    to: 'start' | 'end' | 'forward' | 'backward'
  ): void => {
    const objects = queueDocument!.pages[settings.queuePage].objects.slice(0);
    switch (to) {
      case 'start':
        objects.sort((a, b) => {
          if (fromUUIDs.includes(a.uuid)) {
            return 1;
          }
          if (fromUUIDs.includes(b.uuid)) {
            return -1;
          }
          return 0;
        });
        break;
      case 'end':
        objects.sort((a, b) => {
          if (fromUUIDs.includes(a.uuid)) {
            return -1;
          }
          if (fromUUIDs.includes(b.uuid)) {
            return 1;
          }
          return 0;
        });
        break;
      case 'forward':
        fromUUIDs.forEach((uuid) => {
          const objectIndex = objects.findIndex(
            (object) => object.uuid === uuid
          );
          const object = objects[objectIndex];
          objects.splice(objectIndex, 1);
          objects.splice(Math.min(objectIndex + 1, objects.length), 0, object);
        });
        break;
      case 'backward':
        fromUUIDs.forEach((uuid) => {
          const objectIndex = objects.findIndex(
            (object) => object.uuid === uuid
          );
          const object = objects[objectIndex];
          objects.splice(objectIndex, 1);
          objects.splice(Math.min(objectIndex - 1, objects.length), 0, object);
        });
        break;
    }
    const newPages = queueDocument!.pages.slice(0);
    newPages[settings.queuePage] = {
      ...queueDocument!.pages[settings.queuePage],
      objects: objects,
    };
    setQueueDocument({
      ...queueDocument!,
      pages: newPages,
    });
  };

  return {
    queueDocument,
    changeObjectIndex,
  };
};
