import { createAction } from '@reduxjs/toolkit';
import { QueueDocument } from 'model/document';

/**
 * 이 액션은 최초 문서 로딩시에만 사용되어야 함
 * 각각의 독립적인 스토어에서 update 사용할 것
 */
export const loadDocument = createAction<QueueDocument | null>('Document/setDocument');
