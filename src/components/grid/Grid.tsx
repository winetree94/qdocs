import clsx from 'clsx';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { forwardRef, FunctionComponent, useRef } from 'react';

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
  renderer?: FunctionComponent<GridCellRendererProps<T>>;
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
        'grid-root',
        'grid-root',
        'tw-flex',
        'tw-flex-col',
        'tw-overflow-hidden',
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
    <QueueScrollArea.Root className={clsx('tw-flex-shrink-0')}>
      <QueueScrollArea.Viewport ref={ref} onScroll={props.onScroll}>
        {props.children}
      </QueueScrollArea.Viewport>
      <QueueScrollArea.Scrollbar orientation="horizontal" hidden>
        <QueueScrollArea.Thumb />
      </QueueScrollArea.Scrollbar>
    </QueueScrollArea.Root>
  );
});

export interface GridHeaderRowProps {
  children?: React.ReactNode;
}

const GridHeaderRow = (props: GridHeaderRowProps) => {
  return (
    <div className={clsx('grid-header-row', 'tw-flex')}>{props.children}</div>
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
      className={clsx('grid-header-cell', 'tw-flex-shrink-0')}
      style={{ width: width }}>
      {props.children}
    </div>
  );
};

export interface GridBodyProps {
  children?: React.ReactNode;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}

const GridBody = forwardRef<HTMLDivElement, GridBodyProps>((props, ref) => {
  return (
    <QueueScrollArea.Root>
      <QueueScrollArea.Viewport ref={ref} onScroll={props.onScroll}>
        {props.children}
      </QueueScrollArea.Viewport>
      <QueueScrollArea.Scrollbar orientation="horizontal">
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
  return <div className={clsx('grid-row', 'tw-flex')}>{props.children}</div>;
};

export interface GridCellProps {
  width: number;
  children?: React.ReactNode;
}

const GridCell = (props: GridCellProps) => {
  return (
    <div
      className={clsx('grid-cell', 'tw-flex-shrink-0')}
      style={{ width: props.width }}>
      {props.children}
    </div>
  );
};

export interface GridProps<T extends object> {
  className?: string;
  children?: React.ReactNode;
  columnDefs: GridColumnDef<T>[];
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
        <GridHeaderRow>
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
                {columnDef.renderer ? (
                  <columnDef.renderer columnDef={columnDef} rowData={row} />
                ) : null}
              </GridCell>
            ))}
          </GridRow>
        ))}
      </GridBody>
    </GridRoot>
  );
};
