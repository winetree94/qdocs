import { generateUUID } from 'cdk/functions/uuid';
import { createTypedListenerMiddleware } from 'middleware';
import { pagesSlice } from 'store/page/reducer';
import { NormalizedQueueObjectType, objectsSlice } from './reducer';
import { ObjectSelectors } from './selectors';

export const objectMiddleware = createTypedListenerMiddleware();

/**
 * @description
 * 페이지가 제거되면, 페이지에 속한 오브젝트 제거
 */
objectMiddleware.startListening({
  actionCreator: pagesSlice.actions.removePage,
  effect: (action, api) => {
    const state = api.getState();
    const pageId = action.payload;
    const uuids = ObjectSelectors.all(state)
      .filter((object) => object.pageId === pageId)
      .map((object) => object.uuid);
    api.dispatch(objectsSlice.actions.removeMany(uuids));
  },
});

objectMiddleware.startListening({
  actionCreator: pagesSlice.actions.copyPage,
  effect: (action, api) => {
    const state = api.getState();
    const objects = ObjectSelectors.all(state).filter((object) => object.pageId === action.payload.fromId);
    const newObjects = objects.map<NormalizedQueueObjectType>((object) => ({
      ...object,
      uuid: generateUUID(),
      pageId: action.payload.newId,
    }));
    api.dispatch(
      objectsSlice.actions.addMany({
        objects: newObjects,
      }),
    );
  },
});
