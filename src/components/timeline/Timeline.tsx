import { QueueSubtoolbar } from 'app/subtoolbar/Subtoolbar';
import clsx from 'clsx';
import {
  Grid,
  GridCellRendererProps,
  GridColumnDef,
  GridHeaderCellRendererProps,
} from 'components/grid/Grid';
import { useMemo } from 'react';

interface DataType {
  objectName: string;
}

export const Timeline = () => {
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
        cellRenderer: (props: GridCellRendererProps<DataType>) => <>1</>,
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
    return Array.from(new Array(100)).map((_, index) => ({
      objectName: `Object ${index}`,
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
