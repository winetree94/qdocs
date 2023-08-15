import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { QueueObjectType } from 'model/object';
import { DocumentActions } from '../document';
import { ObjectActions } from './actions';

export const objectEntityAdapter = createEntityAdapter<QueueObjectType>({
  selectId: (object) => object.id,
  sortComparer: (a, b) => a.index - b.index,
});

export const objectsSlice = createSlice({
  name: 'objects',
  initialState: objectEntityAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(DocumentActions.loadDocument, (state, action) => {
      if (!action.payload) {
        return objectsSlice.getInitialState();
      }
      return action.payload.objects;
    });

    /**
     * @description
     * 오브젝트 추가
     */
    builder.addCase(ObjectActions.addOne, (state, action) => {
      const index = state.ids.filter(
        (id) => state.entities[id].pageId === action.payload.object.pageId,
      ).length;
      return objectEntityAdapter.addOne(state, {
        ...action.payload.object,
        index: index,
      });
    });

    /**
     * @description
     * 오브젝트 다중 추가
     */
    builder.addCase(ObjectActions.addMany, (state, action) => {
      const objects = action.payload.objects.map<QueueObjectType>(
        (object, index, self) => {
          const previous = self
            .slice(0, index)
            .filter((o) => o.pageId === object.pageId);
          const newIndex = state.ids.filter(
            (id) => state.entities[id].pageId === object.pageId,
          ).length;
          return {
            ...object,
            index: newIndex + previous.length,
          };
        },
      );
      return objectEntityAdapter.addMany(state, objects);
    });

    /**
     * @description
     * 오브젝트 업데이트
     */
    builder.addCase(ObjectActions.updateObject, (state, action) => {
      return objectEntityAdapter.updateOne(state, action.payload);
    });

    /**
     * @description
     * 오브젝트 다중 업데이트
     */
    builder.addCase(ObjectActions.updateObjects, (state, action) => {
      return objectEntityAdapter.updateMany(state, action.payload);
    });

    /**
     * @description
     * 오브젝트를 최우선 순위로 변경
     */
    builder.addCase(ObjectActions.toFront, (state, action) => {
      const object = state.entities[action.payload.id];
      const objects = state.ids.filter(
        (id) => state.entities[id].pageId === object.pageId,
      );
      const index = objects.indexOf(action.payload.id);
      const previousObjects = objects.slice(index);
      previousObjects.forEach((id) => {
        objectEntityAdapter.updateOne(state, {
          id,
          changes: {
            index: state.entities[id].index - 1,
          },
        });
      });
      return objectEntityAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          index: objects.length - 1,
        },
      });
    });

    /**
     * @description
     * 오브젝트를 최하위 순위로 변경
     */
    builder.addCase(ObjectActions.toBack, (state, action) => {
      const object = state.entities[action.payload.id];
      const objects = state.ids.filter(
        (id) => state.entities[id].pageId === object.pageId,
      );
      const index = objects.indexOf(action.payload.id);
      const nextObjects = objects.slice(0, index);
      nextObjects.forEach((id) => {
        objectEntityAdapter.updateOne(state, {
          id,
          changes: {
            index: state.entities[id].index + 1,
          },
        });
      });
      return objectEntityAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          index: 0,
        },
      });
    });

    /**
     * @description
     * 오브젝트를 앞으로 이동
     */
    builder.addCase(ObjectActions.BringForward, (state, action) => {
      const object = state.entities[action.payload.id];
      const pageObjectIds = state.ids.filter(
        (id) => state.entities[id].pageId === object.pageId,
      );
      const currentIndex = pageObjectIds.indexOf(action.payload.id);
      const nextObjectId = pageObjectIds[currentIndex + 1];
      if (!nextObjectId) {
        return;
      }
      objectEntityAdapter.updateMany(state, [
        {
          id: action.payload.id,
          changes: {
            index: state.entities[nextObjectId].index,
          },
        },
        {
          id: nextObjectId,
          changes: {
            index: state.entities[action.payload.id].index,
          },
        },
      ]);
    });

    /**
     * @description
     * 오브젝트를 뒤로 이동
     */
    builder.addCase(ObjectActions.SendBackward, (state, action) => {
      const object = state.entities[action.payload.id];
      const pageObjectIds = state.ids.filter(
        (id) => state.entities[id].pageId === object.pageId,
      );
      const currentIndex = pageObjectIds.indexOf(action.payload.id);
      const previousObjectId = pageObjectIds[currentIndex - 1];
      if (!previousObjectId) {
        return;
      }
      objectEntityAdapter.updateMany(state, [
        {
          id: action.payload.id,
          changes: {
            index: state.entities[previousObjectId].index,
          },
        },
        {
          id: previousObjectId,
          changes: {
            index: state.entities[action.payload.id].index,
          },
        },
      ]);
    });

    /**
     * @description
     * 오브젝트 다중 삭제
     */
    builder.addCase(ObjectActions.removeMany, (state, action) => {
      action.payload.forEach((id) => {
        const object = state.entities[id];
        const objects = state.ids.filter(
          (id) => state.entities[id].pageId === object.pageId,
        );
        const index = objects.indexOf(id);
        const nextObjects = objects.slice(index + 1);
        nextObjects.forEach((id) => {
          objectEntityAdapter.updateOne(state, {
            id,
            changes: {
              index: state.entities[id].index - 1,
            },
          });
        });
      });
      return objectEntityAdapter.removeMany(state, action.payload);
    });
  },
});
