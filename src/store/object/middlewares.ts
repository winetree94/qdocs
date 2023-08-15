import { nanoid } from '@reduxjs/toolkit';
import { createTypedListenerMiddleware } from 'middleware';
import { ObjectSelectors } from './selectors';
import { PageActions } from '../page';
import { ObjectActions } from './actions';
import { SettingsActions, SettingSelectors } from '../settings';
import { EffectSelectors } from '../effect';
import { QueueObjectType } from 'model/object';

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
