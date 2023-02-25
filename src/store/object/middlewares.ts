import { nanoid } from '@reduxjs/toolkit';
import { createTypedListenerMiddleware } from 'middleware';
import { pagesSlice } from 'store/page/reducer';
import { objectsSlice } from './reducer';
import { ObjectSelectors } from './selectors';
import { NormalizedQueueObjectType } from './model';

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
    const ids = ObjectSelectors.all(state)
      .filter((object) => object.pageId === pageId)
      .map((object) => object.id);
    api.dispatch(objectsSlice.actions.removeMany(ids));
  },
});

objectMiddleware.startListening({
  actionCreator: pagesSlice.actions.copyPage,
  effect: (action, api) => {
    const state = api.getState();
    const objects = ObjectSelectors.all(state).filter((object) => object.pageId === action.payload.fromId);
    const newObjects = objects.map<NormalizedQueueObjectType>((object) => ({
      ...object,
      id: nanoid(),
      pageId: action.payload.newId,
    }));
    api.dispatch(
      objectsSlice.actions.addMany({
        objects: newObjects,
      }),
    );
  },
});
