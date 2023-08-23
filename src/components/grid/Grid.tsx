import clsx from 'clsx';
import {
  createContext,
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
  scrollLeft: number;
}

const GridHeader = (props: GridHeaderProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current.scrollLeft = props.scrollLeft;
  }, [props.scrollLeft]);

  return (
    <div
      ref={ref}
      className={clsx('grid-header', 'tw-overflow-x-auto', 'no-scrollbar')}>
      {props.children}
    </div>
  );
};

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
}

const GridBody = (props: GridBodyProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={clsx(
        'grid-body',
        'tw-flex-1',
        'tw-relative',
        'tw-overflow-y-auto',
      )}
      style={props.style}>
      {props.children}
    </div>
  );
};

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
  const [scrollLeft, setScrollLeft] = useState(0);

  console.log('grid rerender');

  return (
    <GridRoot>
      <GridHeader scrollLeft={scrollLeft}>
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
      <GridBody>
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
