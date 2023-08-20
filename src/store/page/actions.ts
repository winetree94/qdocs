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

const duplicatePageWithQueueObjectIds = createAction<{
  fromId: EntityId;
  newId: string;
  index: number;
  objectIds: EntityId[];
  withEffect?: boolean;
}>('Page/duplicatePageWithQueueObjectIds');

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
  duplicatePageWithQueueObjectIds,
  addPage,
  removePage,
  updatePage,
  updatePages,
};
