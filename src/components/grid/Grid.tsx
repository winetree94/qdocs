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

export interface GridCursorProps {
  className?: string;
  style?: React.CSSProperties;
}

export const GridCursor = (props: GridCursorProps) => {
  return (
    <div
      className={clsx('tw-relative', 'tw-z-10', 'tw-h-0', props.className)}
      style={props.style}>
      <div
        className={clsx(
          'tw-absolute',
          'tw-flex',
          'tw-flex-col',
          'tw-h-screen',
          'tw-items-center',
          'tw-cursor-none',
        )}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="24"
          fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19 4C19 1.79086 17.2091 0 15 0H4C1.79086 0 0 1.79086 0 4V15.9555C0 15.9801 0.0199334 16 0.0445225 16H0.0703165C0.119558 16 0.127809 16.0705 0.0798983 16.0819C0.046782 16.0897 0.0366819 16.1319 0.0626481 16.1539L6.91398 21.9599C8.40613 23.2244 10.5939 23.2244 12.086 21.9599L18.9374 16.1539C18.9633 16.1319 18.9532 16.0897 18.9201 16.0819C18.8722 16.0705 18.8804 16 18.9297 16H18.9555C18.9801 16 19 15.9801 19 15.9555V4Z"
            fill="#2C2C2C"
          />
        </svg>
        <div
          className={clsx('tw-border', 'tw-h-full', 'tw-border-black')}></div>
      </div>
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

  return (
    <GridRoot>
      <GridHeader ref={headerRef} onScroll={onScrollHeader}>
        <GridHeaderRow
          style={{
            height: props.headerHeight || 24,
          }}>
          {props.columnDefs.map((columnDef) => (
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
      <GridCursor style={{ top: -16 }}></GridCursor>
      <GridBody ref={bodyRef} onScroll={onScrollBody}>
        {props.rowData.map((row, index) => (
          <GridRow key={index}>
            {props.columnDefs.map((columnDef) => (
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
