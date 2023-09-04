import clsx from 'clsx';
import {
  Grid,
  GridCellRendererProps,
  GridColumnDef,
  GridHeaderCellRendererProps,
} from 'components/grid/Grid';
import { SettingSelectors } from 'store/settings/selectors';
import { TimeLineTrack } from '../../model/timeline/timeline';
import styles from './Timeline.module.scss';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingsActions } from 'store/settings';
import { EffectSelectors } from 'store/effect';
import { useMemo } from 'react';

interface DataType {
  objectName: string;
  objectContents: TimeLineTrack;
}

export interface TimelineProps {
  columnWidth: number;
}

export const Timeline = (props: TimelineProps) => {
  const dispath = useAppDispatch();
  const queueIndex = useAppSelector(SettingSelectors.queueIndex);
  const queuePosition = useAppSelector(SettingSelectors.queuePosition);
  const queueStart = useAppSelector(SettingSelectors.queueStart);
  const { rowIds, tracks } = useAppSelector(SettingSelectors.timelineData);
  const rowHeight = 38;

  const queueIndexString = useMemo(() => queueIndex.toString(), [queueIndex]);
  const maxDurationByIndex = useAppSelector(EffectSelectors.maxDurationByIndex);

  const duration =
    queuePosition === 'forward'
      ? maxDurationByIndex[queueIndex]
      : maxDurationByIndex[queueIndex + 1];

  const columnDefs: GridColumnDef<DataType>[] = [
    {
      field: 'left-margin',
      width: 20,
      headerRenderer: () => <></>,
      cellRenderer: () => <></>,
    },
    ...Array.from(new Array(50)).map((_, index) => ({
      field: `${index}`,
      width: props.columnWidth,
      headerRenderer: (props: GridHeaderCellRendererProps<DataType>) => (
        <div
          className={clsx(
            'tw-relative',
            'tw-text-12',
            'tw-flex',
            'tw-justify-center',
            'tw-h-full',
            'tw-items-center',
            index === queueIndex && 'tw-text-queue-500',
          )}>
          {Number(props.columnDef.field)}
        </div>
      ),
      cellRenderer: (props: GridCellRendererProps<DataType>) => {
        const {
          startQueueIndex: start,
          endQueueIndex: end,
          queueList,
          uniqueColor,
        } = props.rowData.objectContents;

        return (
          <div
            style={{
              backgroundColor:
                start <= index && index <= end ? uniqueColor : '#ffffff',
            }}
            className={clsx(
              styles.Cell,
              props.rowIndex === 0 ? styles.FirstRowCell : '',
              'tw-text-white-100',
              'tw-text-center',
              start > index || end < index
                ? styles.gridDot
                : queueList.includes(index)
                ? styles.queueDot
                : '',
              index === start && 'tw-rounded-l-lg',
              index === end && 'tw-rounded-r-lg',
            )}></div>
        );
      },
    })),
    {
      field: 'right-margin',
      width: 20,
      headerRenderer: () => <></>,
      cellRenderer: () => <></>,
    },
  ];

  const rowData: DataType[] = rowIds.map((rowId, index) => ({
    objectName: `timeline ${rowId} ${index}`,
    objectContents: tracks.find((track) => track.objectId === rowId),
  }));

  const rowHeightGetter = () => {
    return rowHeight;
  };

  const onCursorFieldChange = (field: string) => {
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

    dispath(
      SettingsActions.setQueueIndex({
        queueIndex: targetIndex,
        play: false,
      }),
    );
  };

  return (
    <div className={clsx('tw-flex', 'tw-flex-col', 'tw-h-full', 'tw-flex-1')}>
      <Grid
        cursorField={queueIndexString}
        cursorAnimationStart={queueStart}
        cursorAnimationDuration={duration}
        onCursorFieldChange={onCursorFieldChange}
        className={clsx('tw-flex-1', 'tw-border-t')}
        columnDefs={columnDefs}
        rowData={rowData}
        rowHeightGetter={rowHeightGetter}></Grid>
    </div>
  );
};
