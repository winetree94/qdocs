import { nanoid } from '@reduxjs/toolkit';
import { createTypedListenerMiddleware } from 'middleware';
import { ObjectSelectors } from './selectors';
import { PageActions } from '../page';
import { ObjectActions } from './actions';
import { SettingsActions, SettingSelectors } from '../settings';
import { EffectActions, EffectSelectors } from '../effect';
import { QueueObjectType } from 'model/object';
import { QueueEffectType } from 'model/effect';

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
    const settings = SettingSelectors.settings(state);
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
        queueIndex: settings.queueIndex,
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
        const newModels = [
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
