import clsx from 'clsx';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { forwardRef, FunctionComponent, useMemo, useRef } from 'react';
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

export interface GridInternalColumnDef<T extends object> {
  field: string;
  left: number;
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
        'tw-relative',
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
  scrollWidth?: number;
}

const GridBody = forwardRef<HTMLDivElement, GridBodyProps>((props, ref) => {
  return (
    <QueueScrollArea.Root
      className={clsx(styles.GridBody, 'tw-flex-1', props.className)}>
      <QueueScrollArea.Viewport ref={ref} onScroll={props.onScroll}>
        {props.children}

        <div
          className={clsx('tw-h-0')}
          style={{ width: props.scrollWidth }}></div>
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

export interface GridOverlayProps {
  className?: string;
  style?: React.CSSProperties;
  scrollWidth?: number;
  children?: React.ReactNode;
}

export const GridOverlay = forwardRef<HTMLDivElement, GridOverlayProps>(
  (props, ref) => {
    return (
      <QueueScrollArea.Root
        className={clsx(
          'tw-absolute',
          'tw-top-0',
          'tw-left-0',
          'tw-w-full',
          'tw-h-full',
          'tw-pointer-events-none',
          props.className,
        )}
        style={{
          position: 'absolute',
        }}>
        <QueueScrollArea.Viewport ref={ref}>
          <div style={{ width: props.scrollWidth }}>{props.children}</div>
        </QueueScrollArea.Viewport>
        <QueueScrollArea.Scrollbar orientation="horizontal" hidden>
          <QueueScrollArea.Thumb />
        </QueueScrollArea.Scrollbar>
        <QueueScrollArea.Scrollbar orientation="vertical" hidden>
          <QueueScrollArea.Thumb />
        </QueueScrollArea.Scrollbar>
      </QueueScrollArea.Root>
    );
  },
);

export interface GridCursorProps {
  className?: string;
  style?: React.CSSProperties;
}

export const GridCursor = (props: GridCursorProps) => {
  return (
    <span
      className={clsx(
        'tw-inline-flex',
        'tw-flex-col',
        'tw-items-center',
        props.className,
      )}
      style={props.style}>
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
        className={clsx(
          'tw-border-l',
          'tw-h-full',
          'tw-border-black',
          'tw-h-screen',
        )}></div>
    </span>
  );
};

export interface GridProps<T extends object> {
  className?: string;
  children?: React.ReactNode;
  cursorField?: string;
  columnDefs: GridColumnDef<T>[];
  headerHeight?: number;
  colSpanGetter?: (params: T) => number;
  rowData: T[];
}

export const Grid = <T extends object>(props: GridProps<T>) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const internalColumnDefs = useMemo(() => {
    return props.columnDefs.reduce<GridInternalColumnDef<T>[]>(
      (result, def) => {
        const last = result[result.length - 1];
        const left = last ? last.left + last.width : 0;
        result.push({
          ...def,
          left,
        });
        return result;
      },
      [],
    );
  }, [props.columnDefs]);

  const internalColumnDefsMap = useMemo(() => {
    return internalColumnDefs.reduce<Record<string, GridInternalColumnDef<T>>>(
      (result, def) => {
        result[def.field] = def;
        return result;
      },
      {},
    );
  }, [internalColumnDefs]);

  const cursorDefLeft = useMemo(() => {
    const cursorDef = internalColumnDefsMap[props.cursorField];
    if (!cursorDef) {
      return 0;
    }
    const cursorWidth = 19;
    const cursorHalfWidth = cursorWidth / 2;
    const cursorCenter = cursorDef.left + cursorDef.width / 2;
    return cursorCenter - cursorHalfWidth;
  }, [internalColumnDefsMap, props.cursorField]);

  const totalWidth = useMemo(() => {
    const last = internalColumnDefs[internalColumnDefs.length - 1];
    return last ? last.left + last.width : 0;
  }, [internalColumnDefs]);

  const onScrollHeader = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    overlayRef.current.scrollLeft = event.currentTarget.scrollLeft;
    bodyRef.current.scrollLeft = event.currentTarget.scrollLeft;
  };

  const onScrollBody = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    overlayRef.current.scrollLeft = event.currentTarget.scrollLeft;
    headerRef.current.scrollLeft = event.currentTarget.scrollLeft;
  };

  return (
    <GridRoot>
      <GridHeader ref={headerRef} onScroll={onScrollHeader}>
        <GridHeaderRow
          style={{
            height: props.headerHeight || 24,
          }}>
          {internalColumnDefs.map((columnDef) => (
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
      <GridBody ref={bodyRef} onScroll={onScrollBody} scrollWidth={totalWidth}>
        {props.rowData.map((row, index) => (
          <GridRow key={index}>
            {internalColumnDefs.map((columnDef) => (
              <GridCell key={columnDef.field} width={columnDef.width}>
                {columnDef.cellRenderer ? (
                  <columnDef.cellRenderer columnDef={columnDef} rowData={row} />
                ) : null}
              </GridCell>
            ))}
          </GridRow>
        ))}
      </GridBody>
      <GridOverlay ref={overlayRef} scrollWidth={totalWidth}>
        <GridCursor
          style={{ marginTop: 20, marginLeft: cursorDefLeft }}></GridCursor>
      </GridOverlay>
    </GridRoot>
  );
};
