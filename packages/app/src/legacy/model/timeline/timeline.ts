import { EntityId } from '@reduxjs/toolkit';

export interface TimeLineTrack {
  startQueueIndex?: number;
  endQueueIndex?: number;
  queueList?: number[];
  title?: string;
  objectId?: EntityId;
  uniqueColor: string;
  selectedTrack: boolean;
}

export interface TimeLineTracks {
  rowIds: EntityId[];
  tracks: TimeLineTrack[];
}
