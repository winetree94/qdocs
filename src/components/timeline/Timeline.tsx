import clsx from 'clsx';
import {
  Grid,
  GridCellRendererProps,
  GridColumnDef,
  GridHeaderCellRendererProps,
} from 'components/grid/Grid';
import { SettingSelectors } from 'store/settings/selectors';
import { TimeLineTrack, TimeLineTracks } from '../../model/timeline/timeline';
import styles from './Timeline.module.scss';
import { getTimelineTracks } from './timeline-data';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingsActions } from 'store/settings';

interface DataType {
  objectName: string;
  objectContents: TimeLineTrack;
}

export const Timeline = () => {
  const dispath = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);
  const { rowIds, tracks }: TimeLineTracks = getTimelineTracks(settings.pageId);

  const rowHeight = 38;

  const columnDefs: GridColumnDef<DataType>[] = [
    {
      field: 'left-margin',
      width: 20,
      headerRenderer: () => <></>,
      cellRenderer: () => <></>,
    },
    ...Array.from(new Array(50)).map((_, index) => ({
      field: `${index}`,
      width: 40,
      headerRenderer: (props: GridHeaderCellRendererProps<DataType>) => (
        <div
          className={clsx(
            'tw-relative',
            'tw-text-12',
            'tw-flex',
            'tw-justify-center',
            'tw-h-full',
            'tw-items-center',
            'tw-cursor-pointer',
            index === settings.queueIndex && 'tw-text-purple-500',
          )}
          onClick={() =>
            dispath(
              SettingsActions.setQueueIndex({
                queueIndex: Number(props.columnDef.field),
                play: false,
              }),
            )
          }>
          {Number(props.columnDef.field) + 1}
        </div>
      ),
      cellRenderer: (props: GridCellRendererProps<DataType>) => {
        const {
          startQueueIndex: start,
          endQueueIndex: end,
          queueList,
        } = props.rowData.objectContents;

        return (
          <div
            className={clsx(
              styles.Cell,
              start <= index && index <= end
                ? 'tw-bg-purple-500'
                : 'tw-bg-white',
              'tw-text-white',
              'tw-text-center',
              start > index || end < index
                ? styles.gridDot
                : queueList.includes(index)
                ? styles.queueDot
                : '',
              index === 0 && 'tw-rounded-l-lg',
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

  const rowData: DataType[] = Array.from(rowIds).map((id, index) => ({
    objectName: `timeline ${id} ${index}`,
    objectContents: tracks[0],
  }));

  const rowHeightGetter = () => rowHeight;

  const colspanGetter = (params: DataType, field: string) => {
    if (field === 'left-margin' || field === 'right-margin') {
      return 1;
    }
    // TODO colspan 계산해야 함
    return 2;
  };

  const onCursorFieldChange = (field: string) => {
    console.log(field);
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
        onCursorFieldChange={onCursorFieldChange}
        className={clsx('tw-flex-1', 'tw-border-t')}
        columnDefs={columnDefs}
        rowData={rowData}
        rowHeightGetter={rowHeightGetter}
        colSpanGetter={colspanGetter}></Grid>
    </div>
  );
};
