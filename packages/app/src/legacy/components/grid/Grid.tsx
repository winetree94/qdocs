import { Animators, AnimatorsProps } from '@legacy/cdk/animation/Animator';
import clsx from 'clsx';
import { QueueScrollArea } from '@legacy/components/scroll-area/ScrollArea';
import {
  forwardRef,
  FunctionComponent,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './Grid.module.scss';

export interface GridHeaderCellRendererProps<T extends object> {
  columnDef: GridColumnDef<T>;
}

export interface GridCellRendererProps<T extends object> {
  columnDef: GridColumnDef<T>;
  cellIndex: number;
  rowIndex: number;
  rowData: T;
}

export interface GridColumnDef<T extends object> {
  field: string;
  width: number;
  headerRenderer?: FunctionComponent<GridColumnDef<T>>;
  cellRenderer?: FunctionComponent<GridCellRendererProps<T>>;
}

export interface GridInternalColumnDef<T extends object> {
  field: string;
  left: number;
  width: number;
  headerRenderer?: FunctionComponent<GridColumnDef<T>>;
  cellRenderer?: FunctionComponent<GridCellRendererProps<T>>;
}

export interface GridInternalRowData<T extends object> {
  top: number;
  height: number;
  rowIndex: number;
  data: T;
  cells: GridInternalField<T>[];
}

export interface GridInternalField<T extends object> {
  columnDef: GridColumnDef<T>;
  field: string;
  data: T;
  cellIndex: number;
  left: number;
  width: number;
  colspan: number;
}

export interface GridRootProps {
  className?: string;
  children?: React.ReactNode;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}

const GridRoot = forwardRef<HTMLDivElement, GridRootProps>((props, ref) => {
  return (
    <div
      ref={ref}
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
});

export interface GridHeaderProps {
  children?: React.ReactNode;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  onDragTransformX?: (transformX: number) => void;
  onDragEnd?: (transformX: number) => void;
}

const GridHeader = forwardRef<HTMLDivElement, GridHeaderProps>((props, ref) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [initEvent, setInitEvent] = useState<React.MouseEvent<
    HTMLDivElement,
    MouseEvent
  > | null>(null);

  useImperativeHandle(ref, () => scrollRef.current);

  useEffect(() => {
    if (!initEvent) {
      return;
    }

    const getDeltaX = (event: MouseEvent) => {
      const rootRect = scrollRef.current.getBoundingClientRect();
      const scrollLeft = scrollRef.current.scrollLeft || 0;
      const deltaX = scrollLeft + event.clientX - rootRect.left;
      return deltaX;
    };

    const clean = () => {
      window.removeEventListener('mousemove', onMousemove);
      window.removeEventListener('mouseup', onMouseup);
    };

    const onMousemove = (event: MouseEvent) => {
      const deltaX = getDeltaX(event);
      props.onDragTransformX?.(deltaX);
    };

    const onMouseup = (event: MouseEvent) => {
      const deltaX = getDeltaX(event);
      props.onDragEnd?.(deltaX);
      setInitEvent(null);
      clean();
    };

    const deltaX = getDeltaX(initEvent.nativeEvent);
    props.onDragTransformX?.(deltaX);
    window.addEventListener('mousemove', onMousemove);
    window.addEventListener('mouseup', onMouseup);

    return clean;
  }, [initEvent]);

  return (
    <QueueScrollArea.Root
      onMouseDown={(event) => {
        setInitEvent(event);
      }}
      className={clsx(styles.GridHeader, 'tw-flex-shrink-0', 'tw-pb-2.5')}
      type="always">
      <QueueScrollArea.Viewport
        ref={scrollRef}
        onScroll={props.onScroll}
        className={clsx('tw-relative')}>
        {props.children}
      </QueueScrollArea.Viewport>
      <QueueScrollArea.Scrollbar
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
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
  top: number;
  height: number;
  width?: number;
}

const GridHeaderRow = (props: GridHeaderRowProps) => {
  return (
    <div
      className={clsx(styles.GridHeaderRow, 'grid-header-row', 'tw-relative')}
      style={{
        top: props.top,
        height: props.height,
        width: props.width,
      }}>
      {props.children}
    </div>
  );
};

export interface GridHeaderCellProps {
  fixed?: 'left' | 'right';
  left: number;
  width: number;
  children?: React.ReactNode;
}

const GridHeaderCell = memo(
  ({ width = 50, left, ...props }: GridHeaderCellProps) => {
    return (
      <div
        className={clsx(
          styles.GridHeaderCell,
          'grid-header-cell',
          'tw-h-full',
          'tw-absolute',
        )}
        style={{ left: left, width: width }}>
        {props.children}
      </div>
    );
  },
);

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
      <QueueScrollArea.Viewport
        ref={ref}
        onScroll={props.onScroll}
        className={clsx('tw-relative')}>
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

export interface GridBodyRowProps {
  children?: React.ReactNode;
  top: number;
  height: number;
}

const GridRow = (props: GridBodyRowProps) => {
  return (
    <div
      className={clsx(
        styles.GridBodyRow,
        'grid-row',
        'tw-absolute',
        'tw-left-0',
      )}
      style={{ top: props.top, height: props.height }}>
      {props.children}
    </div>
  );
};

export interface GridBodyCellProps {
  left: number;
  width: number;
  children?: React.ReactNode;
}

const GridCell = memo((props: GridBodyCellProps) => {
  return (
    <div
      className={clsx(
        styles.GridBodyCell,
        'grid-cell',
        'tw-absolute',
        'tw-h-full',
        'tw-flex',
        'tw-items-center',
      )}
      style={{ left: props.left, width: props.width }}>
      {props.children}
    </div>
  );
});

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
        <QueueScrollArea.Viewport
          ref={ref}
          className={clsx('!tw-overflow-hidden')}>
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
  overlayRef: React.RefObject<HTMLDivElement>;
  onDragTransformX?: (transformX: number) => void;
  onDragEnd?: (transformX: number) => void;
}

export const GridCursor = memo((props: GridCursorProps) => {
  const [initEvent, setInitEvent] = useState<React.MouseEvent<
    HTMLSpanElement | SVGSVGElement,
    MouseEvent
  > | null>(null);

  useEffect(() => {
    if (!initEvent) {
      return;
    }

    const getDeltaX = (event: MouseEvent) => {
      const rootRect = props.overlayRef.current.getBoundingClientRect();
      const scrollLeft = props.overlayRef.current.scrollLeft || 0;
      const deltaX = scrollLeft + event.clientX - rootRect.left;
      return deltaX;
    };

    const clean = () => {
      window.removeEventListener('mousemove', onMousemove);
      window.removeEventListener('mouseup', onMouseup);
    };

    const onMousemove = (event: MouseEvent) => {
      document.body.classList.add('tw-cursor-col-resize');
      const deltaX = getDeltaX(event);
      props.onDragTransformX?.(deltaX);
    };

    const onMouseup = (event: MouseEvent) => {
      document.body.classList.remove('tw-cursor-col-resize');
      const deltaX = getDeltaX(event);
      props.onDragEnd?.(deltaX);
      setInitEvent(null);
      clean();
    };

    window.addEventListener('mousemove', onMousemove);
    window.addEventListener('mouseup', onMouseup);

    return clean;
  }, [initEvent]);

  const onMousedown = (
    event: React.MouseEvent<HTMLSpanElement | SVGSVGElement, MouseEvent>,
  ) => {
    setInitEvent(event);
  };

  return (
    <span
      className={clsx(
        'tw-inline-flex',
        'tw-flex-col',
        'tw-items-center',
        'tw-justify-center',
        'tw-pointer-events-auto',
        'tw-cursor-col-resize',
        props.className,
      )}
      style={{
        ...props.style,
      }}
      onMouseDown={onMousedown}>
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
          'tw-w-3',
          'tw-flex',
          'tw-justify-center',
          'tw-poitner-events-auto',
          'tw-cursor-col-resize',
        )}
        onMouseDown={onMousedown}>
        <div
          className={clsx(
            'tw-border-black-900',
            'tw-border-l',
            'tw-width-1',
            'tw-h-screen',
          )}></div>
      </div>
    </span>
  );
});

const usePrevious = <T,>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
};

export interface GridProps<T extends object> {
  className?: string;
  children?: React.ReactNode;
  cursorField?: string;
  cursorTransitionDuration?: number;
  onCursorFieldChange?: (field: string) => void;
  columnDefs: GridColumnDef<T>[];
  headerHeight?: number;
  rowData: T[];
  rowHeightGetter?: (params: T, index: number, self: T[]) => number;
  colSpanGetter?: (params: T, field: string) => number;

  cursorAnimationStart?: number;
  cursorAnimationDuration?: number;
}

export const Grid = <T extends object>(props: GridProps<T>) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [cursorTransformX, setCursorTransformX] = useState<number | null>(null);

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

  const internalRowData = useMemo(() => {
    return props.rowData.reduce<GridInternalRowData<T>[]>(
      (result, row, index, self) => {
        const last = result[result.length - 1];
        const top = last ? last.top + last.height : 0;
        const height = props.rowHeightGetter
          ? props.rowHeightGetter(row, index, self)
          : 24;

        const cells = internalColumnDefs.reduce<GridInternalField<T>[]>(
          (result, def, cellIndex) => {
            const colSpan = props.colSpanGetter
              ? props.colSpanGetter(row, def.field)
              : 1;
            const last = result[result.length - 1];
            const left = last ? last.left + last.width : 0;
            const width = def.width * colSpan;
            result.push({
              columnDef: def,
              cellIndex: cellIndex,
              field: def.field,
              data: row,
              left: left,
              width: width,
              colspan: colSpan,
            });
            return result;
          },
          [],
        );

        result.push({
          top,
          height,
          data: row,
          rowIndex: index,
          cells: cells,
        });
        return result;
      },
      [],
    );
  }, [internalColumnDefs, props]);

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

  const previousCursorDefLeft = usePrevious(cursorDefLeft);

  const totalWidth = useMemo(() => {
    const last = internalColumnDefs[internalColumnDefs.length - 1];
    return last ? last.left + last.width : 0;
  }, [internalColumnDefs]);

  const onScrollHeader = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      overlayRef.current.scrollLeft = event.currentTarget.scrollLeft;
      bodyRef.current.scrollLeft = event.currentTarget.scrollLeft;
    },
    [overlayRef, bodyRef],
  );

  const onScrollBody = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      overlayRef.current.scrollLeft = event.currentTarget.scrollLeft;
      headerRef.current.scrollLeft = event.currentTarget.scrollLeft;
    },
    [overlayRef, headerRef],
  );

  const onCursorDragmove = (x: number) => {
    const adjacentCenter = Math.max(
      Math.min(Math.max(x, 0), totalWidth) - 19 / 2,
      0,
    );
    const cursorField = internalColumnDefs.find((def) => {
      return (
        adjacentCenter >= def.left && adjacentCenter <= def.left + def.width
      );
    })?.field;
    setCursorTransformX(adjacentCenter);
    if (cursorField) {
      props.onCursorFieldChange?.(cursorField);
    }
  };

  const onCursorDragEnd = (x: number) => {
    const deltaX = Math.max(Math.min(Math.max(x, 0), totalWidth) - 19 / 2, 0);
    const cursorDef = internalColumnDefs.find((def) => {
      return deltaX >= def.left && deltaX <= def.left + def.width;
    });
    props.onCursorFieldChange?.(cursorDef.field);
    setCursorTransformX(null);
  };

  const cursorAnimations = useMemo<AnimatorsProps['animations']>(() => {
    return [
      {
        delay: 0,
        duration: props.cursorAnimationDuration || 0,
        timing: 'linear',
      },
    ];
  }, [props.cursorAnimationDuration]);

  return (
    <GridRoot ref={rootRef}>
      <GridHeader
        ref={headerRef}
        onScroll={onScrollHeader}
        onDragTransformX={onCursorDragmove}
        onDragEnd={onCursorDragEnd}>
        <GridHeaderRow
          top={0}
          height={props.headerHeight || 24}
          width={totalWidth}>
          {internalColumnDefs.map((columnDef) => (
            <GridHeaderCell
              key={columnDef.field}
              left={columnDef.left}
              width={columnDef.width}>
              {columnDef.headerRenderer ? (
                <columnDef.headerRenderer {...columnDef} />
              ) : (
                columnDef.field
              )}
            </GridHeaderCell>
          ))}
        </GridHeaderRow>
      </GridHeader>
      <GridBody
        className={clsx('tw-mt-1')}
        ref={bodyRef}
        onScroll={onScrollBody}
        scrollWidth={totalWidth}>
        {internalRowData.map((row, index) => (
          <GridRow key={index} top={row.top} height={row.height}>
            {row.cells.map((cell) => (
              <GridCell key={cell.field} left={cell.left} width={cell.width}>
                {cell.columnDef.cellRenderer ? (
                  <cell.columnDef.cellRenderer
                    columnDef={cell.columnDef}
                    cellIndex={cell.cellIndex}
                    rowIndex={row.rowIndex}
                    rowData={row.data}
                  />
                ) : null}
              </GridCell>
            ))}
          </GridRow>
        ))}
      </GridBody>

      <GridOverlay ref={overlayRef} scrollWidth={totalWidth}>
        {props.cursorField && (
          <Animators
            start={props.cursorAnimationStart}
            animations={cursorAnimations}>
            {([progress]) => {
              if (!cursorDefLeft) {
                return;
              }
              const prevDefLeft = previousCursorDefLeft || 0;
              const left =
                prevDefLeft + (cursorDefLeft - prevDefLeft) * (progress || 0);
              return (
                <GridCursor
                  onDragTransformX={onCursorDragmove}
                  onDragEnd={onCursorDragEnd}
                  overlayRef={overlayRef}
                  style={{
                    marginTop: 20,
                    marginLeft:
                      cursorTransformX !== null ? cursorTransformX : left,
                  }}></GridCursor>
              );
            }}
          </Animators>
        )}
      </GridOverlay>
    </GridRoot>
  );
};
