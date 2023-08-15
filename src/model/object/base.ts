import { EntityId } from '@reduxjs/toolkit';

export interface BaseObject {
  type: string;
  index: number;
  id: EntityId;
  pageId: EntityId;
}
