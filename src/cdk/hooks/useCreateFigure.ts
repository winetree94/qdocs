import { Dispatch, EntityId, nanoid } from '@reduxjs/toolkit';
import { QueueDocumentRect } from 'model/document';
import { QueueObjectType, createDefaultImage } from 'model/object';
import { useCallback } from 'react';
import { RootState } from 'store';
import { QueueDocument } from 'store/document';
import { HistoryActions } from 'store/history';
import { ObjectActions } from 'store/object';
import { QueueDocumentSettings, SettingsActions } from 'store/settings';
import {
  ImageEncodingMessage,
  IMAGE_ENCODING_STATUS,
} from 'workers/imageConversionWorker';

export const useCreateFigure = (
  queueDocument: RootState,
  settings: QueueDocumentSettings,
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
        const figure = createDefaultShape(
          queueDocument.document.documentRect,
          settings.pageId,
          iconClassName,
        );
        const object = {
          pageId: settings.pageId,
          ...figure,
        };
        dispatch(HistoryActions.Capture());
        dispatch(
          ObjectActions.addOne({
            queueIndex: settings.queueIndex,
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
    [queueDocument, settings, dispatch],
  );

  return createFigure;
};

export const useCreateImage = (
  queueDocument: RootState,
  settings: QueueDocumentSettings,
  dispatch: Dispatch<any>,
) => {
  const createFigure = useCreateFigure(queueDocument, settings, dispatch);
  return createFigure((documentRect: QueueDocumentRect, pageId: EntityId) => {
    const objectId = nanoid();
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = false;

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      const worker = new Worker(
        /* webpackChunkName: "image-encoding-worker" */ new URL(
          '../../workers/imageConversionWorker.ts',
          import.meta.url,
        ),
      );

      worker.addEventListener(
        'message',
        (event: MessageEvent<ImageEncodingMessage>) => {
          const { status, imageData } = event.data;

          switch (status) {
            case IMAGE_ENCODING_STATUS.ENCODED:
              dispatch(
                ObjectActions.updateImageObject({
                  id: objectId,
                  changes: {
                    image: {
                      src: imageData.src,
                      alt: imageData.fileName,
                      assetId: nanoid(),
                    },
                  },
                }),
              );

              break;
            case IMAGE_ENCODING_STATUS.ERROR:
              dispatch(ObjectActions.removeMany([objectId]));
              break;
          }
        },
      );

      worker.postMessage(file);
    });

    fileInput.click();

    // 이미지 업로드 -> base64로 인코딩 완료할 때 까지 로딩 표시된 상태로 default image object 만들어두기?
    // 로딩중 상태로 만들어 뒀다가 이미지 붙이면 사라지도록 하면 좋을듯?
    return createDefaultImage(documentRect, pageId, objectId);
  });
};
