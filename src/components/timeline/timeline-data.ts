import { useAppSelector } from 'store/hooks';
import { TimeLineTrack, TimeLineTracks } from '../../model/timeline/timeline';
import { EntityId } from '@reduxjs/toolkit';

export const getTimelineTracks = (pageId: EntityId): TimeLineTracks => {
  const objectIds: EntityId[] = [];
  const tracks = useAppSelector((state) =>
    Object.values(state.objects.entities)
      .filter((value) => value.pageId === pageId)
      .reduce((acc, object) => {
        objectIds.push(object.id);
        const effects = Object.values(state.effects.entities).filter(
          (entity) => entity.objectId === object.id,
        );

        const filtered = effects.map((effect) => effect.index);
        const queueList = effects.reduce((acc, effect) => {
          if (!acc.includes(effect.index)) {
            acc.push(effect.index);
          }
          return acc;
        }, [] as number[]);

        const item: TimeLineTrack = {
          objectId: object.id,
          startQueueIndex: filtered[0],
          endQueueIndex: filtered[filtered.length - 1],
          uniqueColor: object.uniqueColor,
          queueList,
        };

        acc.push(item);
        return acc;
      }, [] as TimeLineTrack[]),
  );

  const timelineData = {
    rowIds: objectIds,
    tracks,
  };

  return timelineData;
};
