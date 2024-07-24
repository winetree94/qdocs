import { Dispatch, EntityId } from '@reduxjs/toolkit';
import { QueueDocumentRect } from '@legacy/model/document';
import { QueueObjectType, QueueImage } from '@legacy/model/object';
import { useCallback } from 'react';
import { store } from '@legacy/store';
import { DocumentSelectors } from '@legacy/store/document';
import { HistoryActions } from '@legacy/store/history';
import { ObjectActions } from '@legacy/store/object';
import { SettingsActions } from '@legacy/store/settings';

export const useCreateFigure = (
  pageId: EntityId,
  queueIndex: number,
  dispatch: Dispatch<any>,
) => {
  const createFigure = useCallback(
    (
      createDefaultShape: (
        documentRect: QueueDocumentRect,
        pageId: EntityId,
        iconType?: string,
      ) => QueueObjectType,
    ): ((iconClassName?: string) => void) => {
      return (iconClassName) => {
        const rect = DocumentSelectors.documentRect(store.getState());
        const figure = createDefaultShape(rect, pageId, iconClassName);
        const object = {
          pageId: pageId,
          ...figure,
        };
        dispatch(HistoryActions.Capture());
        dispatch(
          ObjectActions.addOne({
            queueIndex: queueIndex,
            object: object,
          }),
        );
        dispatch(
          SettingsActions.setSelection({
            selectionMode: 'normal',
            ids: [object.id],
          }),
        );
      };
    },
    [dispatch, pageId, queueIndex],
  );

  return createFigure;
};

export const useCreateImage = (
  pageId: EntityId,
  queueIndex: number,
  dispatch: Dispatch<any>,
) => {
  const createFigure = useCallback(
    (
      createDefaultShape: (
        documentRect: QueueDocumentRect,
        pageId: EntityId,
        imageData?: QueueImage['image'],
      ) => QueueObjectType,
    ): ((imageData?: QueueImage['image']) => void) => {
      return (imageData) => {
        const rect = DocumentSelectors.documentRect(store.getState());
        const figure = createDefaultShape(rect, pageId, imageData);
        const object = {
          pageId: pageId,
          ...figure,
        };
        dispatch(HistoryActions.Capture());
        dispatch(
          ObjectActions.addOne({
            queueIndex: queueIndex,
            object: object,
          }),
        );
        dispatch(
          SettingsActions.setSelection({
            selectionMode: 'normal',
            ids: [object.id],
          }),
        );
      };
    },
    [dispatch, pageId, queueIndex],
  );

  return createFigure;
};
