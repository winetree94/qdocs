import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';

const selectSelf = (state: RootState) => state.document;

/**
 * @description
 * 문서의 메타 정보(이름, 크기, 페이지 목록)를 반환하는 selector
 */
const document = createSelector(selectSelf, (docs) => docs);

/**
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
  serialized,
  documentRect,
};
