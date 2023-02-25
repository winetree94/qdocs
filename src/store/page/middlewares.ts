import { isAnyOf } from '@reduxjs/toolkit';
import { createTypedListenerMiddleware } from 'middleware';
import { pagesSlice } from './reducer';
import { PageSelectors } from './selectors';
import { NormalizedQueueDocumentPage } from './model';

export const pageMiddleware = createTypedListenerMiddleware();

/**
 * @description
 * 페이지가 추가 / 제거되면 인덱스 재정렬
 */
pageMiddleware.startListening({
  matcher: isAnyOf(pagesSlice.actions.removePage, pagesSlice.actions.copyPage, pagesSlice.actions.addPage),
  effect: (_, api) => {
    const state = api.getState();
    const pageGroup = PageSelectors.all(state).reduce<Record<string, NormalizedQueueDocumentPage[]>>((result, page) => {
      if (!result[page.documentId]) {
        result[page.documentId] = [];
      }
      result[page.documentId].push(page);
      return result;
    }, {});
    const changes = Object.values(pageGroup).reduce<{ id: string; changes: { index: number } }[]>((result, pages) => {
      pages.sort((a, b) => a.index - b.index);
      pages.forEach((page, index) => {
        if (page.index === index) {
          return;
        }
        result.push({
          id: page.id,
          changes: { index: index },
        });
      });
      return result;
    }, []);
    if (!changes.length) {
      return;
    }
    console.log('reordered');
    api.dispatch(pagesSlice.actions.updatePages(changes));
  },
});
