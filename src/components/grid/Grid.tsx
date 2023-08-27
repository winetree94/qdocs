import clsx from 'clsx';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { forwardRef, FunctionComponent, useRef } from 'react';
import styles from './Grid.module.scss';

export interface GridHeaderCellRendererProps<T extends object> {
  columnDef: GridColumnDef<T>;
}

export interface GridCellRendererProps<T extends object> {
  columnDef: GridColumnDef<T>;
  rowData: T;
}

export interface GridColumnDef<T extends object> {
  field: string;
  width: number;
  headerRenderer?: FunctionComponent<GridHeaderCellRendererProps<T>>;
  cellRenderer?: FunctionComponent<GridCellRendererProps<T>>;
}

export interface GridRootProps {
  className?: string;
  children?: React.ReactNode;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}

const GridRoot = (props: GridRootProps) => {
  return (
    <div
      className={clsx(
        styles.GridRoot,
        'grid-root',
        'grid-root',
        'tw-flex',
        'tw-flex-col',
        'tw-overflow-hidden',
        'tw-h-full',
        props.className,
      )}
      onScroll={props.onScroll}>
      {props.children}
    </div>
  );
};

export interface GridHeaderProps {
  children?: React.ReactNode;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}

const GridHeader = forwardRef<HTMLDivElement, GridHeaderProps>((props, ref) => {
  return (
    <QueueScrollArea.Root
      className={clsx(styles.GridHeader, 'tw-flex-shrink-0', 'tw-pb-2.5')}
      type="always">
      <QueueScrollArea.Viewport ref={ref} onScroll={props.onScroll}>
        {props.children}
      </QueueScrollArea.Viewport>
      <QueueScrollArea.Scrollbar
        orientation="horizontal"
        className={clsx('tw-h-2', 'tw-border-y', 'tw-p-0')}>
        <QueueScrollArea.Thumb
          className={clsx(styles.GridTimelineScrollbar, 'tw-h-2.5')}
        />
      </QueueScrollArea.Scrollbar>
    </QueueScrollArea.Root>
  );
});

export interface GridHeaderRowProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const GridHeaderRow = (props: GridHeaderRowProps) => {
  return (
    <div
      className={clsx(styles.GridHeaderRow, 'grid-header-row', 'tw-flex')}
      style={props.style}>
      {props.children}
    </div>
  );
};

export interface GridHeaderCellProps {
  fixed?: 'left' | 'right';
  width: number;
  children?: React.ReactNode;
}

const GridHeaderCell = ({ width = 50, ...props }: GridHeaderCellProps) => {
  return (
    <div
      className={clsx(
        styles.GridHeaderCell,
        'grid-header-cell',
        'tw-flex-shrink-0',
      )}
      style={{ width: width }}>
      {props.children}
    </div>
  );
};

export interface GridBodyProps {
  className?: string;
  children?: React.ReactNode;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}

const GridBody = forwardRef<HTMLDivElement, GridBodyProps>((props, ref) => {
  return (
    <QueueScrollArea.Root
      className={clsx(styles.GridBody, 'tw-flex-1', props.className)}>
      <QueueScrollArea.Viewport ref={ref} onScroll={props.onScroll}>
        {props.children}
      </QueueScrollArea.Viewport>
      <QueueScrollArea.Scrollbar orientation="horizontal" hidden>
        <QueueScrollArea.Thumb />
      </QueueScrollArea.Scrollbar>
      <QueueScrollArea.Scrollbar orientation="vertical">
        <QueueScrollArea.Thumb />
      </QueueScrollArea.Scrollbar>
    </QueueScrollArea.Root>
  );
});

export interface GridRowProps {
  children?: React.ReactNode;
}

const GridRow = (props: GridRowProps) => {
  return (
    <div className={clsx(styles.GridBodyRow, 'grid-row', 'tw-flex')}>
      {props.children}
    </div>
  );
};

export interface GridCellProps {
  width: number;
  children?: React.ReactNode;
}

const GridCell = (props: GridCellProps) => {
  return (
    <div
      className={clsx(
        styles.GridBodyCell,
        'grid-cell',
        'tw-flex-shrink-0',
        'tw-relative',
      )}
      style={{ width: props.width }}>
      {props.children}
    </div>
  );
};

export interface GridProps<T extends object> {
  className?: string;
  children?: React.ReactNode;
  columnDefs: GridColumnDef<T>[];
  headerHeight?: number;
  colSpanGetter?: (params: T) => number;
  rowData: T[];
}

export const Grid = <T extends object>(props: GridProps<T>) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const onScrollHeader = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    bodyRef.current.scrollLeft = event.currentTarget.scrollLeft;
  };

  const onScrollBody = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    headerRef.current.scrollLeft = event.currentTarget.scrollLeft;
  };

  console.log(props.rowData);

  return (
    <GridRoot>
      <GridHeader ref={headerRef} onScroll={onScrollHeader}>
        <GridHeaderRow
          style={{
            height: props.headerHeight || 24,
          }}>
          {props.columnDefs.map((columnDef, index) => (
            <GridHeaderCell key={columnDef.field} width={columnDef.width}>
              {columnDef.headerRenderer ? (
                <columnDef.headerRenderer columnDef={columnDef} />
              ) : (
                columnDef.field
              )}
            </GridHeaderCell>
          ))}
        </GridHeaderRow>
      </GridHeader>
      <GridBody ref={bodyRef} onScroll={onScrollBody}>
        {props.rowData.map((row, index) => (
          <GridRow key={index}>
            {props.columnDefs.map((columnDef, index) => (
              <GridCell key={columnDef.field} width={columnDef.width}>
                {columnDef.cellRenderer ? (
                  <columnDef.cellRenderer columnDef={columnDef} rowData={row} />
                ) : null}
              </GridCell>
            ))}
          </GridRow>
        ))}
      </GridBody>
    </GridRoot>
  );
};
