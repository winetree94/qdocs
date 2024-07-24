import { createAction } from '@reduxjs/toolkit';
import { QueueDocumentRect } from '@legacy/model/document';
import { RootState } from 'store';

/**
 * @description
 * 이 액션 발생 시 모든 스토어가 초기화됨, 최초 문서 로딩시에만 사용되어야 함
 * 문서 로딩 이후의 동작은 각각의 독립적인 액션을 사용할 것
 */
const loadDocument = createAction<Omit<RootState, 'history'> | null>(
  'Document/setDocument',
);

/**
 * @description
 * 문서를 닫음
 */
const closeDocument = createAction('Document/closeDocument');

const changeName = createAction<string>('Document/changeName');

const updateDocumentRect = createAction<{
  changes: Partial<QueueDocumentRect>;
}>('Document/updateDocumentRect');

export const DocumentActions = {
  loadDocument,
  closeDocument,
  changeName,
  updateDocumentRect,
};
