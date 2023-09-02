import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';

const selectSelf = (state: RootState) => state.document;

/**
 * @description
 * 문서의 메타 정보(이름, 크기, 페이지 목록)를 반환하는 selector
 */
const document = createSelector(selectSelf, (docs) => docs);

const documentId = createSelector(selectSelf, (docs) => docs.id);

/**
 * @deprecated
 * 화면 렌더링에 필요하지 않은 데이터를 셀렉하는 셀렉터이기 때문에
 * ./functions.ts의 serializeDocument를 사용하여 직접 직렬화하는 것을 권장
 *
 * @description
 * 문서를 파일로 저장하기 위한 데이터 형식을 반환하는 셀렉터로, 일반적으로 사용하지 않음
 */
const serialized = createSelector(
  (state: RootState) => state,
  (state) => {
    if (!state.document) {
      return null;
    }
    const newState = { ...state };
    delete newState.history;
    delete newState.perferences;
    delete newState.settings;
    return newState;
  },
);

const documentRect = createSelector(selectSelf, (docs) => docs.documentRect);

export const DocumentSelectors = {
  document,
  documentId,
  serialized,
  documentRect,
};
