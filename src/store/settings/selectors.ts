import { RootState } from 'store';
import { createSelector, EntityId } from '@reduxjs/toolkit';
import { ObjectSelectors } from 'store/object/selectors';
import { QueueDocumentSettings } from './model';
import { EffectSelectors } from 'store/effect/selectors';
import { QueueObjectType } from 'model/object';
import { OBJECT_EFFECT_TYPE } from 'model/effect';
import {
  supportFade,
  supportFill,
  supportRect,
  supportRotation,
  supportScale,
  supportStroke,
  supportText,
} from 'model/support';
import { TimeLineTrack } from 'model/timeline/timeline';

const selectSelf = (state: RootState): QueueDocumentSettings => state.settings;

const pageId = createSelector(selectSelf, (settings) => settings.pageId);

const queueIndex = createSelector(selectSelf, (state) => state.queueIndex);

const queuePosition = createSelector(
  selectSelf,
  (state) => state.queuePosition,
);

const queueStart = createSelector(selectSelf, (state) => state.queueStart);

const autoPlay = createSelector(selectSelf, (settings) => settings.autoPlay);

const scale = createSelector(selectSelf, (settings) => settings.scale);

const leftPanelOpened = createSelector(
  selectSelf,
  (settings) => settings.leftPanelOpened,
);

const bottomPanelOpened = createSelector(
  selectSelf,
  (settings) => settings.bottomPanelOpened,
);

const selectionMode = createSelector(
  selectSelf,
  (settings) => settings.selectionMode,
);

const presentationMode = createSelector(
  selectSelf,
  (settings) => settings.presentationMode,
);

const selectedObjectIds = createSelector(
  selectSelf,
  (settings) => settings.selectedObjectIds,
);

const autoPlayRepeat = createSelector(
  selectSelf,
  (settings) => settings.autoPlayRepeat,
);

const pageObjects = createSelector(
  [selectSelf, ObjectSelectors.all],
  (settings, objects) =>
    objects.filter((object) => object.pageId === settings.pageId),
);

const pageObjectIds = createSelector(
  [selectSelf, ObjectSelectors.byPageId],
  (settings, objects) => {
    return objects[settings.pageId]?.map(({ id }) => id) || [];
  },
);

const selectedObjects = createSelector(
  [selectSelf, ObjectSelectors.entities],
  (settings, objectEntities) =>
    settings.selectedObjectIds.map((id) => objectEntities[id]),
);

/**
 * @description
 * 현재 Page, 현재 Index 의 오브젝트의 상태(크기, 좌표 등)를 조회
 * 에디터에서 현재 위치의 오브젝트들을 화면에 표시하기 위해 사용
 */
const allEffectedObjects = createSelector(
  [pageId, queueIndex, ObjectSelectors.all, EffectSelectors.effectsByObjectId],
  (pageId, queueIndex, objects, effects) => {
    return objects
      .filter((object) => object.pageId === pageId)
      .reduce<QueueObjectType[]>((result, current) => {
        const object = { ...current };
        (effects[current.id] || [])
          .filter(({ index }) => index <= queueIndex)
          .filter(
            (effect) => effect.type !== 'create' && effect.type !== 'remove',
          )
          .forEach((effect) => {
            if (
              effect.type === OBJECT_EFFECT_TYPE.RECT &&
              supportRect(object)
            ) {
              object.rect = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.FADE &&
              supportFade(object)
            ) {
              object.fade = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.FILL &&
              supportFill(object)
            ) {
              object.fill = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.STROKE &&
              supportStroke(object)
            ) {
              object.stroke = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.ROTATE &&
              supportRotation(object)
            ) {
              object.rotate = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.SCALE &&
              supportScale(object)
            ) {
              object.scale = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.TEXT &&
              supportText(object)
            ) {
              object.text = effect.prop;
            }
          });
        result.push(object);
        return result;
      }, []);
  },
);

/**
 * @description
 * allEffectedObjects 를 Map 형태로 변환
 */
const allEffectedObjectsMap = createSelector(
  [allEffectedObjects],
  (objects) => {
    return objects.reduce<Record<string, QueueObjectType>>((result, object) => {
      result[object.id] = object;
      return result;
    }, {});
  },
);

const timelineData = createSelector(
  [ObjectSelectors.all, EffectSelectors.all, pageId],
  (objects, allEffects, pageId) => {
    const objectIds: EntityId[] = [];
    const tracks = objects
      .filter((value) => value.pageId === pageId)
      .reduce((acc, object) => {
        objectIds.push(object.id);
        const effects = allEffects.filter(
          (entity) => entity.objectId === object.id,
        );

        const filtered = effects.map((effect) => effect.index);
        const queueList = effects.reduce((acc, effect) => {
          if (!acc.includes(effect.index)) {
            acc.push(effect.index);
          }
          return acc;
        }, [] as number[]);

        const item: TimeLineTrack = {
          objectId: object.id,
          startQueueIndex: filtered[0],
          endQueueIndex: filtered[filtered.length - 1],
          uniqueColor: object.uniqueColor,
          queueList,
        };

        acc.push(item);
        return acc;
      }, [] as TimeLineTrack[]);

    const timelineData = {
      rowIds: objectIds,
      tracks,
    };

    return timelineData;
  },
);

const currentVisibleObjects = createSelector(
  [queueIndex, pageObjects, EffectSelectors.effectsByObjectId],
  (queueIndex, objects, effects) => {
    return objects.filter((object) => {
      const createEffect = (effects[object.id] || []).find(
        (effect) => effect.type === 'create',
      );
      const removeEffect = (effects[object.id] || []).find(
        (effect) => effect.type === 'remove',
      );
      if (!createEffect) {
        return false;
      }
      if (queueIndex < createEffect.index) {
        return false;
      }
      if (removeEffect && queueIndex > removeEffect.index) {
        return false;
      }
      return true;
    });
  },
);

export const SettingSelectors = {
  pageId,
  queueIndex,
  autoPlayRepeat,
  pageObjects,
  pageObjectIds,
  selectedObjects,
  selectedObjectIds,
  selectionMode,
  scale,
  queuePosition,
  presentationMode,
  queueStart,
  autoPlay,
  leftPanelOpened,
  bottomPanelOpened,
  allEffectedObjects,
  allEffectedObjectsMap,
  timelineData,
  currentVisibleObjects,
};
