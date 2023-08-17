import { createAction, EntityId } from '@reduxjs/toolkit';
import { NormalizedQueueDocumentPage } from './model';

const switchPageIndex = createAction<{
  from: EntityId;
  to: EntityId;
}>('Page/switchPageIndex');

const copyPage = createAction<{
  fromId: EntityId;
  newId: string;
  index: number;
}>('Page/copyPage');

const duplicatePageWithLastQueueObjects = createAction<{
  fromId: EntityId;
  newId: string;
  index: number;
  objectIds: EntityId[];
}>('Page/duplicatePageWithLastQueueObjects');

const addPage = createAction<NormalizedQueueDocumentPage>('Page/addPage');

const removePage = createAction<EntityId>('Page/removePage');

const updatePage = createAction<{
  id: EntityId;
  changes: Partial<NormalizedQueueDocumentPage>;
}>('Page/updatePage');

const updatePages = createAction<
  {
    id: EntityId;
    changes: Partial<NormalizedQueueDocumentPage>;
  }[]
>('Page/updatePages');

export const PageActions = {
  switchPageIndex,
  copyPage,
  duplicatePageWithLastQueueObjects,
  addPage,
  removePage,
  updatePage,
  updatePages,
};
