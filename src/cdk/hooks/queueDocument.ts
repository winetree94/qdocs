import { QueueDocument } from 'model/document';
import { QueueObjectType } from 'model/object';
import { QueueRect, QueueRotate } from 'model/property';
import { useRecoilState } from 'recoil';
import { documentState } from 'store/document';
import { useSettings } from './settings';

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
  updateObjectRects: (
    models: RectUpdateModel[]
  ) => void;
  updateObjectRotate: (
    models: RotateUpdateModel[]
  ) => void;
  changeObjectIndex: (
    fromUUIDs: string[],
    to: 'start' | 'end' | 'forward' | 'backward',
  ) => void;
  removeObjectOnQueue: (
    uuids: string[]
  ) => void;
  removeObject: (
    uuids: string[]
  ) => void;
  onTextEdit: (
    uuid: string,
    text: string
  ) => void;
}

export const useQueueDocument = (): UseQueueDocument => {
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const { settings, ...setSettings } = useSettings();

  const updateObjectRects = (models: RectUpdateModel[]): void => {
    const newObjects = queueDocument!.pages[settings.queuePage].objects.map((object) => {
      const model = models.find((model) => model.uuid === object.uuid);
      if (!model) {
        return object;
      }
      const slicedObject = { ...object, effects: object.effects.slice(0) };
      const createEffectIndex = object.effects.find(
        (effect) => effect.type === 'create'
      )!.index;
      const moveEffectIndex = object.effects.findIndex(
        (effect) => effect.type === 'move' && effect.index === model.queueIndex
      );

      if (createEffectIndex === model.queueIndex) {
        slicedObject.rect = model.rect;
      }

      if (createEffectIndex !== model.queueIndex && moveEffectIndex !== -1) {
        slicedObject.effects[moveEffectIndex] = {
          ...slicedObject.effects[moveEffectIndex],
          type: 'move',
          rect: {
            ...model.rect,
          },
        };
      }

      if (createEffectIndex !== model.queueIndex && moveEffectIndex === -1) {
        slicedObject.effects.push({
          type: 'move',
          index: model.queueIndex,
          duration: 1000,
          timing: 'linear',
          rect: {
            ...model.rect,
          },
        });
        slicedObject.effects.sort((a, b) => a.index - b.index);
      }

      return slicedObject;
    });
    const newPages = queueDocument!.pages.slice(0);
    newPages[settings.queuePage] = {
      ...queueDocument!.pages[settings.queuePage],
      objects: newObjects
    };
    setQueueDocument({ ...queueDocument!, pages: newPages });
  };

  const updateObjectRotate = (models: RotateUpdateModel[]): void => {
    const newObjects = queueDocument!.pages[settings.queuePage].objects.map((object) => {
      const model = models.find((model) => model.uuid === object.uuid);
      if (!model) {
        return object;
      }
      const slicedObject = { ...object, effects: object.effects.slice(0) };
      const createEffectIndex = object.effects.find(
        (effect) => effect.type === 'create'
      )!.index;
      const rotateEffectIndex = object.effects.findIndex(
        (effect) => effect.type === 'rotate' && effect.index === model.queueIndex
      );

      if (createEffectIndex === model.queueIndex) {
        slicedObject.rotate = model.rotate;
      }

      if (createEffectIndex !== model.queueIndex && rotateEffectIndex !== -1) {
        slicedObject.effects[rotateEffectIndex] = {
          ...slicedObject.effects[rotateEffectIndex],
          type: 'rotate',
          rotate: {
            ...model.rotate,
          },
        };
      }

      if (createEffectIndex !== model.queueIndex && rotateEffectIndex === -1) {
        slicedObject.effects.push({
          type: 'rotate',
          index: model.queueIndex,
          duration: 1000,
          timing: 'linear',
          rotate: {
            ...model.rotate,
          },
        });
        slicedObject.effects.sort((a, b) => a.index - b.index);
      }

      return slicedObject;
    });
    const newPages = queueDocument!.pages.slice(0);
    newPages[settings.queuePage] = {
      ...queueDocument!.pages[settings.queuePage],
      objects: newObjects
    };
    setQueueDocument({ ...queueDocument!, pages: newPages });
  };

  const changeObjectIndex = (
    fromUUIDs: string[],
    to: 'start' | 'end' | 'forward' | 'backward',
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
          const objectIndex = objects.findIndex((object) => object.uuid === uuid);
          const object = objects[objectIndex];
          objects.splice(objectIndex, 1);
          objects.splice(Math.min(objectIndex + 1, objects.length), 0, object);
        });
        break;
      case 'backward':
        fromUUIDs.forEach((uuid) => {
          const objectIndex = objects.findIndex((object) => object.uuid === uuid);
          const object = objects[objectIndex];
          objects.splice(objectIndex, 1);
          objects.splice(Math.min(objectIndex - 1, objects.length), 0, object);
        });
        break;
    }
    const newPages = queueDocument!.pages.slice(0);
    newPages[settings.queuePage] = {
      ...queueDocument!.pages[settings.queuePage],
      objects: objects
    };
    setQueueDocument({
      ...queueDocument!,
      pages: newPages,
    });
  };

  const removeObjectOnQueue = (uuids: string[]): void => {
    const newObjects = queueDocument!.pages[settings.queuePage].objects.reduce<QueueObjectType[]>((result, object) => {
      if (!uuids.includes(object.uuid)) {
        result.push(object);
        return result;
      }
      const newObject: QueueObjectType = {
        ...object,
        effects: object.effects
          .filter((effect) => effect.index < settings.queueIndex)
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
      objects: newObjects
    };
    setQueueDocument({
      ...queueDocument!,
      pages: newPages,
    });
  };

  const removeObject = (uuids: string[]): void => {
    const newObjects = queueDocument!.pages[settings.queuePage].objects.filter((object) => !uuids.includes(object.uuid));
    const newPages = queueDocument!.pages.slice(0);
    newPages[settings.queuePage] = {
      ...queueDocument!.pages[settings.queuePage],
      objects: newObjects
    };
    setQueueDocument({
      ...queueDocument!,
      pages: newPages,
    });
  };

  const onTextEdit = (objectId: string, text: string): void => {
    const objectIndex = queueDocument!.pages[settings.queuePage].objects.findIndex((object) => object.uuid === objectId);
    const object = queueDocument!.pages[settings.queuePage].objects[objectIndex];
    const newObject = {
      ...object,
      text: {
        ...object.text,
        text: text,
      },
    };
    const newObjects = queueDocument!.pages[settings.queuePage].objects.slice(0);
    newObjects[objectIndex] = newObject;
    const newPages = queueDocument!.pages.slice(0);
    newPages[settings.queuePage] = {
      ...queueDocument!.pages[settings.queuePage],
      objects: newObjects
    };
    setQueueDocument({
      ...queueDocument!,
      pages: newPages,
    });
  };

  return {
    queueDocument,
    updateObjectRects,
    updateObjectRotate,
    changeObjectIndex,
    removeObjectOnQueue,
    removeObject,
    onTextEdit,
  };
};
