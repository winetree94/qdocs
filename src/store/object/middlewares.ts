import { nanoid } from '@reduxjs/toolkit';
import { createTypedListenerMiddleware } from 'middleware';
import { ObjectSelectors } from './selectors';
import { PageActions } from '../page';
import { ObjectActions } from './actions';
import { SettingsActions, SettingSelectors } from '../settings';
import { EffectActions, EffectSelectors } from '../effect';
import { QueueObjectType } from 'model/object';
import { OBJECT_EFFECT_TYPES, QueueEffectType } from 'model/effect';
import {
  supportCreateEffect,
  supportFade,
  supportFadeEffect,
  supportFill,
  supportRect,
  supportRectEffect,
  supportRotateEffect,
  supportRotation,
  supportScale,
  supportScaleEffect,
  supportStroke,
  supportStrokeEffect,
} from 'model/support';

export const objectMiddleware = createTypedListenerMiddleware();

/**
 * @description
 * 페이지가 제거되면, 페이지에 속한 오브젝트 제거
 */
objectMiddleware.startListening({
  actionCreator: PageActions.removePage,
  effect: (action, api) => {
    const state = api.getState();
    const pageId = action.payload;
    const ids = ObjectSelectors.all(state)
      .filter((object) => object.pageId === pageId)
      .map((object) => object.id);
    api.dispatch(ObjectActions.removeMany(ids));
  },
});

objectMiddleware.startListening({
  actionCreator: PageActions.copyPage,
  effect: (action, api) => {
    const state = api.getState();
    const objects = ObjectSelectors.all(state).filter(
      (object) => object.pageId === action.payload.fromId,
    );
    const newObjects = objects.map<QueueObjectType>((object) => ({
      ...object,
      id: nanoid(),
      pageId: action.payload.newId,
    }));
    api.dispatch(
      ObjectActions.addMany({
        objects: newObjects,
      }),
    );
  },
});

objectMiddleware.startListening({
  actionCreator: ObjectActions.duplicate,
  effect: (action, api) => {
    const state = api.getState();
    const queueIndex = SettingSelectors.queueIndex(state);
    const effects = EffectSelectors.allEffectedObjectsMap(state);
    const models = action.payload.ids.map<QueueObjectType>((id) => ({
      ...effects[id],
      rect: {
        ...effects[id].rect,
        x: effects[id].rect.x + 10,
        y: effects[id].rect.y + 10,
      },
      id: nanoid(),
    }));
    api.dispatch(
      ObjectActions.addMany({
        queueIndex: queueIndex,
        objects: models,
      }),
    );
    api.dispatch(
      SettingsActions.setSelection({
        selectionMode: 'normal',
        ids: models.map((model) => model.id),
      }),
    );
  },
});

objectMiddleware.startListening({
  actionCreator: PageActions.duplicatePageWithQueueObjectIds,
  effect: (action, api) => {
    const state = api.getState();
    const currentPageObjects = ObjectSelectors.allByPageId(
      state,
      action.payload.fromId,
    );
    const currentPageEffects = EffectSelectors.allByPageId(
      state,
      action.payload.fromId,
    );
    const copyTargetObjects = currentPageObjects.filter((object) =>
      action.payload.objectIds.includes(object.id),
    );

    const { newModels, newEffects } = action.payload.objectIds.reduce<{
      newModels: QueueObjectType[];
      newEffects: QueueEffectType[];
    }>(
      (acc, objectId) => {
        const newObjectId = nanoid();
        let newModels = [
          ...acc.newModels,
          {
            ...copyTargetObjects.find(
              (copyTargetObject) => copyTargetObject.id === objectId,
            ),
            id: newObjectId,
            pageId: action.payload.newId,
          },
        ];
        let newEffects = acc.newEffects;

        if (!action.payload.withEffect) {
          // 이펙트를 가져가지 않는다면 마지막 큐 까지의 이펙트를 모두 합친 후 object 기본 속성으로 만들어야 함 -> 마지막 큐의 오브젝트만 가지고 복제되어야 하기 때문임
          const myEffects = currentPageEffects
            .filter((effect) => effect.objectId === objectId)
            .slice()
            .sort((a, b) => a.index - b.index);

          const myLastQueueEffects = myEffects.reduce<
            Partial<Record<OBJECT_EFFECT_TYPES, QueueEffectType>>
          >((acc, effect) => {
            acc[effect.type] = effect;

            return acc;
          }, {});

          let targetObject = copyTargetObjects.find(
            (copyTargetObject) => copyTargetObject.id === objectId,
          );

          if (supportCreateEffect(targetObject)) {
            targetObject = {
              ...targetObject,
            };
          }

          if (supportRect(targetObject) && supportRectEffect(targetObject)) {
            targetObject.rect = {
              ...targetObject.rect,
              ...(myLastQueueEffects.rect?.prop || {}),
            };
          }

          if (
            supportStroke(targetObject) &&
            supportStrokeEffect(targetObject)
          ) {
            targetObject.stroke = {
              ...targetObject.stroke,
              ...(myLastQueueEffects.stroke?.prop || {}),
            };
          }

          if (supportFade(targetObject) && supportFadeEffect(targetObject)) {
            targetObject.fade = {
              ...targetObject.fade,
              ...(myLastQueueEffects.fade?.prop || {}),
            };
          }

          if (supportFill(targetObject) && supportFadeEffect(targetObject)) {
            targetObject.fill = {
              ...targetObject.fill,
              ...(myLastQueueEffects.fill?.prop || {}),
            };
          }

          if (
            supportRotation(targetObject) &&
            supportRotateEffect(targetObject)
          ) {
            targetObject.rotate = {
              ...targetObject.rotate,
              ...(myLastQueueEffects.rotate?.prop || {}),
            };
          }

          if (supportScale(targetObject) && supportScaleEffect(targetObject)) {
            targetObject.scale = {
              ...targetObject.scale,
              ...(myLastQueueEffects.scale?.prop || {}),
            };
          }

          newModels = [
            ...acc.newModels,
            {
              ...targetObject,
              id: newObjectId,
              pageId: action.payload.newId,
            },
          ];
        }

        if (action.payload.withEffect) {
          newEffects = [
            ...acc.newEffects,
            ...currentPageEffects
              .filter(
                (currentPageEffect) => currentPageEffect.objectId === objectId,
              )
              .map((currentPageEffect) => ({
                ...currentPageEffect,
                id: nanoid(),
                objectId: newObjectId,
              })),
          ];
        }

        return {
          newModels,
          newEffects,
        };
      },
      {
        newModels: [],
        newEffects: [],
      },
    );

    api.dispatch(
      ObjectActions.addMany({
        objects: newModels,
        queueIndex:
          action.payload.withEffect && newEffects.length > 0 ? undefined : 0,
      }),
    );

    if (action.payload.withEffect && newEffects.length > 0) {
      api.dispatch(EffectActions.upsertEffects(newEffects));
    }
  },
});
