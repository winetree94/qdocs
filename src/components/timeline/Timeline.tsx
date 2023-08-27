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
import { useAppSelector } from 'store/hooks';

interface DataType {
  objectName: string;
  objectContents: TimeLineTrack;
}

export const Timeline = () => {
  const settings = useAppSelector(SettingSelectors.settings);
  const { rowIds, tracks }: TimeLineTracks = getTimelineTracks(settings.pageId);

  const columnDefs: GridColumnDef<DataType>[] = [
    {
      field: 'left-margin',
      width: 20,
      headerRenderer: () => <></>,
      cellRenderer: (props: GridCellRendererProps<DataType>) => <></>,
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
            index === settings.queueIndex && 'tw-text-purple-500',
          )}>
          {props.columnDef.field}
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
              start <= index && index <= end
                ? 'tw-bg-purple-500'
                : 'tw-bg-white',
              'tw-text-white',
              'tw-text-center',
              'tw-my-1',
              queueList.includes(index) ? styles.queueDot : styles.gridDot,
              index === 0 && 'tw-rounded-l-lg',
              index === end && 'tw-rounded-r-lg',
            )}>
            <span>&nbsp;</span>
          </div>
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

  const colSpanGetter = (data: DataType): number => {
    return 1;
  };

  const rowData: DataType[] = Array.from(rowIds).map((id, index) => ({
    objectName: `timeline ${id} ${index}`,
    objectContents: tracks[0],
  }));

  return (
    <div className={clsx('tw-flex', 'tw-flex-col', 'tw-h-full', 'tw-flex-1')}>
      <Grid
        cursorField={settings.queueIndex.toString()}
        className={clsx('tw-flex-1', 'tw-border-t')}
        columnDefs={columnDefs}
        rowData={rowData}></Grid>
    </div>
  );
};
