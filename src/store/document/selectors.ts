import { createSelector } from '@reduxjs/toolkit';
import { QueueDocument } from 'model/document';
import { RootState } from 'store';

const selectSelf = (state: RootState) => state.document;

/**
 * @description
 * 문서의 메타 정보(이름, 크기, 페이지 목록)를 반환하는 selector
 */
const selectDocs = createSelector(selectSelf, (docs) => docs);

/**
 * @description
 * 문서를 파일로 저장하기 위한 데이터 형식을 반환하는 셀렉터로, 일반적으로 사용하지 않음
 */
const selectSerializedDocument = createSelector(
  (state: RootState) => state,
  (state) => {
    const legacyDocumentModel: QueueDocument = {
      ...state.document,
      pages: state.document.pages.map((page) => ({
        ...state.pages.entities[page],
        objects: state.pages.entities[page].objects.map((uuid) => state.objects.entities[uuid]),
      })),
    };
    return legacyDocumentModel;
  },
);

export const DocumentSelectors = {
  selectDocs,
  selectSerializedDocument,
};
