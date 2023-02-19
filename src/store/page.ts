import { QueueDocumentPage } from 'model/document';
import { QueueObjectType } from 'model/object';
import { DefaultValue, selector, selectorFamily } from 'recoil';
import { documentState } from './document';

/**
 * @description
 * 페이지 목록을 관리하는 selector
 */
export const queueDocumentPages = selector<QueueDocumentPage[]>({
  key: 'pages',
  get: ({ get }) => {
    const document = get(documentState);
    return document.pages;
  },
  set: ({ set, get }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    const document = get(documentState);
    set(documentState, {
      ...document,
      pages: newValue,
    });
  }
});

/**
 * @description
 * 특정 페이지를 관리하는 selector
 */
export const queueDocumentPage = selectorFamily<
  QueueDocumentPage,
  number
>({
  key: 'pageSelector',
  get: (pageIndex) => ({ get }): QueueDocumentPage => get(queueDocumentPages)[pageIndex],
  set: (pageIndex) => ({ set, get }, newValue): void => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    const pages = get(queueDocumentPages) || [];
    set(queueDocumentPages, [...pages.slice(0, pageIndex), newValue, ...pages.slice(pageIndex + 1)]);
  },
});

/**
 * @description
 * 문서 페이지별 오브젝트들을 관리하는 셀렉터
 */
export const queueDocumentPageObjects = selectorFamily<
  QueueObjectType[],
  number
>({
  key: 'pageObjectsSelector',
  get: (pageIndex) => ({ get }): QueueObjectType[] => {
    return get(queueDocumentPage(pageIndex)).objects;
  },
  set: (pageIndex) => ({ set, get }, newValue): void => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    const selector = queueDocumentPage(pageIndex);
    return set(selector, {
      ...get(selector),
      objects: newValue,
    });
  }
});