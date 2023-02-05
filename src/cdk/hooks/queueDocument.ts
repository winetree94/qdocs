/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  QueueDocument,
} from 'model/document';
import {
  FadeEffect,
  MoveEffect,
  OBJECT_EFFECTS,
  OBJECT_EFFECT_META,
  QueueEffectType,
  RotateEffect,
  ScaleEffect,
  StrokeEffect,
  TextEffect,
} from 'model/effect';
import { OBJECT_SUPPORTED_EFFECTS, OBJECT_SUPPORTED_PROPERTIES, QueueObjectType } from 'model/object';
import { OBJECT_PROPERTIES, QueueRect, QueueRotate } from 'model/property';
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

export interface UpdateObjectProp {
  uuid: string;
  queueIndex: number;
  props: {
    rect?: Partial<Omit<MoveEffect, 'type' | 'index'>>;
    rotate?: Partial<Omit<RotateEffect, 'type' | 'index'>>;
    stroke?: Partial<Omit<StrokeEffect, 'type' | 'index'>>;
    scale?: Partial<Omit<ScaleEffect, 'type' | 'index'>>;
    text?: Partial<Omit<TextEffect, 'type' | 'index'>>;
    fade?: Partial<Omit<FadeEffect, 'type' | 'index'>>;
  };
}

export interface UseQueueDocument {
  readonly queueDocument: QueueDocument;
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
  updateObjectProp: (
    pageIndex: number,
    models: UpdateObjectProp[]
  ) => void;
}

/**
 * todo
 * update temporary visible prop
 */
export const useQueueDocument = (): UseQueueDocument => {
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const { settings, ...setSettings } = useSettings();

  const updateObjectProp = (
    pageIndex: number,
    models: UpdateObjectProp[]
  ): void => {
    const slicedPage = {
      ...queueDocument!.pages[pageIndex],
      objects: queueDocument!.pages[pageIndex].objects.slice(0),
    };
    models.forEach((model) => {
      const objectIndex = slicedPage.objects.findIndex((object) => object.uuid === model.uuid);
      const slicedObject = {
        ...slicedPage.objects[objectIndex],
        effects: slicedPage.objects[objectIndex].effects.slice(0),
      };
      const objectType = slicedObject.type;

      const createEffectIndex = slicedObject.effects.find(
        (effect) => effect.type === OBJECT_EFFECT_META.CREATE,
      )!.index;

      const removeEffectIndex = slicedObject.effects.findIndex(
        (effect) => effect.type === OBJECT_EFFECT_META.REMOVE,
      );

      Object.entries(model.props).forEach(([key, value]) => {
        // 지원 안되는 속성인 경우 중단
        if (!OBJECT_SUPPORTED_PROPERTIES[objectType].includes(key as OBJECT_PROPERTIES)) {
          console.warn('object type not supported');
          return;
        }
        // 이펙트로 지원 안되는 속성인 경우 무조건 루트에 반영
        if (!OBJECT_SUPPORTED_EFFECTS[objectType].includes(key as OBJECT_EFFECTS)) {
          (slicedObject as any)[key as OBJECT_PROPERTIES] = (value as any)[key] || (slicedObject as any)[key];
          return;
        }
        // 생성 이펙트에서 수정한 경우 무조건 루트에 반영
        if (createEffectIndex === model.queueIndex) {
          (slicedObject as any)[key as OBJECT_PROPERTIES] = (value as any)[key] || (slicedObject as any)[key];
          return;
        }
        // 삭제 이후의 이펙트를 수정하려고 한 경우 중단
        if (removeEffectIndex !== -1 && removeEffectIndex <= model.queueIndex) {
          console.warn('remove effect index is smaller than queue index');
          return slicedObject;
        }
        // 기존 이펙트
        const effectIndex = slicedObject.effects.findIndex(
          (effect) => effect.type === key && effect.index === model.queueIndex
        );
        const existEffect = slicedObject.effects[effectIndex];

        const effect = {
          type: key,
          index: model.queueIndex,
          duration: value.duration || existEffect?.duration || 1000,
          timing: value.timing || existEffect?.timing || 'linear',
          [key]: (value as any)[key] || (existEffect as any)?.[key],
        } as QueueEffectType;

        if (effectIndex !== -1) {
          slicedObject.effects[effectIndex] = effect;
        } else {
          slicedObject.effects.push(effect);
        }

        slicedObject.effects.sort((a, b) => a.index - b.index);
      });

      slicedPage.objects[objectIndex] = slicedObject;
    });

    const newPages = queueDocument!.pages.slice(0);
    newPages[pageIndex] = slicedPage;
    setQueueDocument({ ...queueDocument!, pages: newPages });

    return;
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

  return {
    queueDocument,
    changeObjectIndex,
    removeObjectOnQueue,
    removeObject,
    updateObjectProp,
  };
};
