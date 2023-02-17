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

export interface RectUpdateModel {
  uuid: string;
  queueIndex: number;
  rect: QueueRect;
}

export interface RotateUpdateModel {
  uuid: string;
  queueIndex: number;
  rotate: QueueRotate;
}



export interface UseQueueDocument {
  readonly queueDocument: QueueDocument;
  readonly selectedObjects: QueueObjectType[];
  changeObjectIndex: (
    fromUUIDs: string[],
    to: 'start' | 'end' | 'forward' | 'backward'
  ) => void;
  removeObjectOnQueue: (uuids: string[]) => void;
  removeObject: (uuids: string[]) => void;
}

/**
 * todo
 * update temporary visible prop
 */
export const useQueueDocument = (): UseQueueDocument => {
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const { settings, ...setSettings } = useSettings();

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

  const removeObjectOnQueue = (uuids: string[]): void => {
    const newObjects = queueDocument!.pages[settings.queuePage].objects.reduce<
      QueueObjectType[]
    >((result, object) => {
      if (!uuids.includes(object.uuid)) {
        result.push(object);
        return result;
      }
      const newObject: QueueObjectType = {
        ...object,
        effects: object.effects.filter(
          (effect) => effect.index < settings.queueIndex
        ),
      };
      if (newObject.effects.length === 0) {
        return result;
      }
      newObject.effects.push({
        index: settings.queueIndex,
        duration: 0,
        timing: 'linear',
        type: 'remove',
      });
      result.push(newObject);
      return result;
    }, []);
    setSettings.setSelectedObjectUUIDs([]);
    const newPages = queueDocument!.pages.slice(0);
    newPages[settings.queuePage] = {
      ...queueDocument!.pages[settings.queuePage],
      objects: newObjects,
    };
    setQueueDocument({
      ...queueDocument!,
      pages: newPages,
    });
  };

  const removeObject = (uuids: string[]): void => {
    const newObjects = queueDocument!.pages[settings.queuePage].objects.filter(
      (object) => !uuids.includes(object.uuid)
    );
    const newPages = queueDocument!.pages.slice(0);
    newPages[settings.queuePage] = {
      ...queueDocument!.pages[settings.queuePage],
      objects: newObjects,
    };
    setQueueDocument({
      ...queueDocument!,
      pages: newPages,
    });
  };

  const selectedObjects = queueDocument.pages[
    settings.queuePage
  ].objects.filter((object) =>
    settings.selectedObjectUUIDs.includes(object.uuid)
  );

  return {
    queueDocument,
    selectedObjects,
    changeObjectIndex,
    removeObjectOnQueue,
    removeObject,
  };
};
