import { useAppSelector } from 'store/hooks';
import { TimelineRail, TimeLineTrack } from '../../model/timeline/timeline';

export const getTimelineTracks = (pageId: string): TimelineRail => {
  let rangeStart = 99999;
  let rangeEnd = 0;
  const objectIds = [];
  const tracks = useAppSelector((state) =>
    Object.values(state.objects.entities)
      .filter((value) => value.pageId === pageId)
      .reduce((acc, object) => {
        objectIds.push(object.id);
        const effects = Object.values(state.effects.entities).filter(
          (entity) => entity.objectId === object.id,
        );

        const filtered = effects.map((effect) => {
          if (effect.index < rangeStart) {
            rangeStart = effect.index;
          }

          if (effect.index > rangeEnd) {
            rangeEnd = effect.index;
          }
          return effect.index;
        });

        const item: TimeLineTrack = {
          objectId: object.id,
          startQueueIndex: filtered[0],
          endQueueIndex: filtered[filtered.length - 1],
          queueList: [...new Set([...filtered])],
        };

        acc.push(item);
        return acc;
      }, [] as TimeLineTrack[]),
  );

  const rail: TimelineRail = {
    rangeEnd,
    rangeStart,
    tracks,
  };

  console.log('tracks: ', tracks);
  console.log('rail: ', rail);

  return rail;
};
