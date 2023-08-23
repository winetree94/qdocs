import clsx from 'clsx';
import {
  createContext,
  forwardRef,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface GridColumnDef<T extends object> {
  field: string;
  width: number;
  headerRenderer?: FunctionComponent<GridColumnDef<T>>;
  renderer?: FunctionComponent<T>;
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
    <div
      ref={ref}
      className={clsx('grid-header', 'tw-overflow-x-auto', 'no-scrollbar')}
      onScroll={props.onScroll}>
      {props.children}
    </div>
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
  style?: React.CSSProperties;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}

const GridBody = forwardRef<HTMLDivElement, GridBodyProps>((props, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'grid-body',
        'tw-flex-1',
        'tw-relative',
        'tw-overflow-y-auto',
      )}
      style={props.style}
      onScroll={props.onScroll}>
      {props.children}
    </div>
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
  console.log('grid rerender');

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
                <columnDef.headerRenderer {...columnDef} />
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
                {columnDef.renderer ? <columnDef.renderer {...row} /> : null}
              </GridCell>
            ))}
          </GridRow>
        ))}
      </GridBody>
    </GridRoot>
  );
};
