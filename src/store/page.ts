import { QueueDocumentPage } from 'model/document';
import { QueueObjectType } from 'model/object';
import { DefaultValue, selectorFamily } from 'recoil';
import { documentState } from './document';

/**
 * @description
 * 페이지별 오브젝트들을 관리하는 셀렉터
 */
export const documentPage = selectorFamily<
  QueueDocumentPage,
  number
>({
  key: 'pageSelector',
  get: (pageIndex) => ({ get }): QueueDocumentPage => {
    const document = get(documentState);
    return document.pages[pageIndex];
  },
  set: (pageIndex) => ({ set, get }, newValue): void => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    const document = get(documentState);
    set(documentState, {
      ...document,
      pages: [...document!.pages.slice(0, pageIndex), newValue, ...document!.pages.slice(pageIndex + 1)]
    });
  }
});

/**
 * @description
 * 문서 페이지별 오브젝트들을 관리하는 셀렉터
 */
export const documentPageObjects = selectorFamily<
  QueueObjectType[],
  number
>({
  key: 'pageObjectsSelector',
  get: (pageIndex) => ({ get }): QueueObjectType[] => {
    return get(documentPage(pageIndex)).objects;
  },
  set: (pageIndex) => ({ set, get }, newValue): void => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    const selector = documentPage(pageIndex);
    return set(selector, {
      ...get(selector),
      objects: newValue,
    });
  }
});