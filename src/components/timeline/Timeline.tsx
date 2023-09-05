import clsx from 'clsx';
import {
  Grid,
  GridCellRendererProps,
  GridColumnDef,
} from 'components/grid/Grid';
import { SettingSelectors } from 'store/settings/selectors';
import { TimeLineTrack } from '../../model/timeline/timeline';
import styles from './Timeline.module.scss';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingsActions } from 'store/settings';
import { EffectSelectors } from 'store/effect';
import { memo, useCallback, useMemo } from 'react';
import { store } from 'store';
import { isEqual } from 'lodash';

const ROW_HEIGHT = 38;

export interface TimelineProps {
  columnWidth: number;
}

const TimelineEmptyRenderer = memo(() => <></>);

const TimelineHeaderRenderer = memo((props: GridColumnDef<TimeLineTrack>) => (
  <div
    className={clsx(
      'tw-relative',
      'tw-text-12',
      'tw-flex',
      'tw-justify-center',
      'tw-h-full',
      'tw-items-center',
    )}>
    {Number(props.field)}
  </div>
));

const TimelineCellRenderer = (props: GridCellRendererProps<TimeLineTrack>) => {
  const {
    startQueueIndex: start,
    endQueueIndex: end,
    queueList,
    uniqueColor,
    selectedTrack,
  } = props.rowData;

  const cellIndex = props.cellIndex - 1;

  return (
    <div
      style={{
        backgroundColor:
          start <= cellIndex && cellIndex <= end ? uniqueColor : '#ffffff',
      }}
      className={clsx(
        styles.Cell,
        props.rowIndex === 0 ? styles.FirstRowCell : '',
        'tw-text-white-100',
        'tw-text-center',
        start > cellIndex || end < cellIndex
          ? styles.gridDot
          : queueList.includes(cellIndex)
          ? styles.queueDot
          : '',
        cellIndex === start && 'tw-rounded-l-lg',
        cellIndex === end && 'tw-rounded-r-lg',
        start <= cellIndex &&
          cellIndex <= end &&
          selectedTrack &&
          'tw-animate-pulse tw-border-solid tw-border-y-2 tw-border-amber-300',
      )}></div>
  );
};

export const Timeline = memo((props: TimelineProps) => {
  let tracks = useAppSelector(SettingSelectors.timelineData, (a, b) => {
    return isEqual(a, b);
  });

  const dispatch = useAppDispatch();
  const queueIndex = useAppSelector(SettingSelectors.queueIndex);
  const queuePosition = useAppSelector(SettingSelectors.queuePosition);
  const queueStart = useAppSelector(SettingSelectors.queueStart);
  const selectedId = useAppSelector(SettingSelectors.firstSelectedObjectId);

  tracks = tracks.map((track) => {
    track.selectedTrack = track.objectId === selectedId;
    return track;
  });

  const queueIndexString = useMemo(() => queueIndex.toString(), [queueIndex]);
  const maxDurationByIndex = useAppSelector(EffectSelectors.maxDurationByIndex);

  const duration = useMemo(() => {
    return queuePosition === 'forward'
      ? maxDurationByIndex[queueIndex] || 0
      : maxDurationByIndex[queueIndex + 1] || 0;
  }, [maxDurationByIndex, queueIndex, queuePosition]);

  const columnDefs: GridColumnDef<TimeLineTrack>[] = useMemo(() => {
    return [
      {
        field: 'left-margin',
        width: 20,
        headerRenderer: TimelineEmptyRenderer,
        cellRenderer: TimelineEmptyRenderer,
      },
      ...Array.from(new Array(50)).map((_, cellIndex) => ({
        field: `${cellIndex}`,
        width: props.columnWidth,
        headerRenderer: TimelineHeaderRenderer,
        cellRenderer: TimelineCellRenderer,
      })),
      {
        field: 'right-margin',
        width: 20,
        headerRenderer: TimelineEmptyRenderer,
        cellRenderer: TimelineEmptyRenderer,
      },
    ];
  }, [props.columnWidth]);

  const rowHeightGetter = useCallback(() => {
    return ROW_HEIGHT;
  }, []);

  const onCursorFieldChange = useCallback(
    (field: string) => {
      const queueIndex = SettingSelectors.queueIndex(store.getState());
      const targetIndex: number = (() => {
        if (field === 'left-margin') {
          return 0;
        }
        if (field === 'right-margin') {
          return 49;
        }
        return Number(field);
      })();

      if (targetIndex === queueIndex) {
        return;
      }

      dispatch(
        SettingsActions.setQueueIndex({
          queueIndex: targetIndex,
          play: false,
        }),
      );
    },
    [dispatch],
  );

  const memoizedGrid = useMemo(
    () => (
      <Grid
        cursorField={queueIndexString}
        cursorAnimationStart={queueStart}
        cursorAnimationDuration={duration}
        onCursorFieldChange={onCursorFieldChange}
        className={clsx('tw-flex-1', 'tw-border-t')}
        columnDefs={columnDefs}
        rowData={tracks}
        rowHeightGetter={rowHeightGetter}></Grid>
    ),
    [
      columnDefs,
      duration,
      onCursorFieldChange,
      queueIndexString,
      queueStart,
      rowHeightGetter,
      tracks,
    ],
  );

  return memoizedGrid;
});
