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

interface DataType {
  objectName: string;
  objectContents: TimeLineTrack;
}

export interface TimelineProps {
  columnWidth: number;
}

export const Timeline = (props: TimelineProps) => {
  const dispath = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);
  const { rowIds, tracks } = useAppSelector(EffectSelectors.timelineData);
  const rowHeight = 38;

  const maxDurationByIndex = useAppSelector(EffectSelectors.maxDurationByIndex);

  const duration =
    settings.queuePosition === 'forward'
      ? maxDurationByIndex[settings.queueIndex]
      : maxDurationByIndex[settings.queueIndex + 1];

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
            index === settings.queueIndex && 'tw-text-purple-500',
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
              'tw-text-white',
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

  const rowHeightGetter = (row: DataType, index: number) => {
    return rowHeight;
  };

  const colspanGetter = (params: DataType, field: string) => {
    if (field === 'left-margin' || field === 'right-margin') {
      return 1;
    }

    // TODO colspan 계산해야 함
    return 1;
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
        cursorField={settings.queueIndex.toString()}
        cursorAnimationStart={settings.queueStart}
        cursorAnimationDuration={duration}
        onCursorFieldChange={onCursorFieldChange}
        className={clsx('tw-flex-1', 'tw-border-t')}
        columnDefs={columnDefs}
        rowData={rowData}
        rowHeightGetter={rowHeightGetter}
        colSpanGetter={colspanGetter}></Grid>
    </div>
  );
};
