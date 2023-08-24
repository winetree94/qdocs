import { QueueSubtoolbar } from 'app/subtoolbar/Subtoolbar';
import clsx from 'clsx';
import {
  Grid,
  GridCellRendererProps,
  GridColumnDef,
  GridHeaderCellRendererProps,
} from 'components/grid/Grid';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SettingSelectors } from 'store/settings/selectors';
import { TimeLineTrack, TimeLineTracks } from '../../model/timeline/timeline';
import styles from './Timeline.module.scss';
import { getTimelineTracks } from './timeline-data';

interface DataType {
  objectName: string;
  objectContents: TimeLineTrack;
}

export const Timeline = () => {
  const currnetPageId = useSelector(SettingSelectors.pageId);
  const { rowIds, tracks }: TimeLineTracks = getTimelineTracks(currnetPageId);
  console.log(rowIds, tracks);

  const columnDefs: GridColumnDef<DataType>[] = useMemo(() => {
    return [
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
          <div className={clsx('tw-text-12', 'tw-flex', 'tw-justify-center')}>
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
        cellRenderer: (props: GridCellRendererProps<DataType>) => <></>,
      },
    ];
  }, []);

  const colSpanGetter = (data: DataType): number => {
    return 1;
  };

  const rowData: DataType[] = useMemo(() => {
    return Array.from(rowIds).map((id, index) => ({
      objectName: `timeline ${id} ${index}`,
      objectContents: tracks[0],
    }));
  }, []);

  return (
    <div className={clsx('tw-flex', 'tw-flex-col', 'tw-h-full')}>
      <QueueSubtoolbar className={clsx('tw-flex-shrink-0')} />
      <Grid
        className={clsx('tw-flex-1', 'tw-border-t')}
        columnDefs={columnDefs}
        rowData={rowData}></Grid>
      {/* <div
          className={clsx(
            'tw-flex',
            'tw-h-[40px]',
            'tw-box-border',
            styles.header,
          )}>
          <div className="tw-text-[14px] tw-p-[12px]">
            <span className="tw-font-extrabold">Timeline</span>
          </div>
          <div className={styles.divider}></div>
          <div className="tw-text-[12px] tw-p-[12px]">
            <span>00m : 13s : 00m</span>
          </div>
        </div>
        <div className={styles.content}>
          <TimeRange />
        </div> */}
    </div>
  );
};
