/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';

interface PanelContextType {
  active: boolean;
  width: number;
  minWidth?: number;
  height: number;
  minHeight?: number;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
}

const PanelContext = React.createContext<PanelContextType>({
  active: false,
  width: 100,
  height: 100,
  setWidth: () => undefined,
  setHeight: () => undefined,
});

export interface PanelResizerPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  panePosition: 'top' | 'right' | 'bottom' | 'left';
  paneWidth?: number;
}

/**
 * @description
 * 패널에서 리사이징 할 수 있는 pane 을 생성
 */
const Pane = ({ children, panePosition, paneWidth = 8, ...props }: PanelResizerPaneProps) => {
  const context = useContext(PanelContext);
  const [initEvent, setInitEvent] = useState<{
    event: React.MouseEvent<HTMLDivElement, MouseEvent>;
    initPosition: number;
  } | null>(null);
  const horizontal = panePosition === 'top' || panePosition === 'bottom';

  useEffect(() => {
    if (!initEvent) {
      return;
    }

    const onMousemove = (event: MouseEvent) => {
      const diff = (() => {
        switch (panePosition) {
          case 'top':
            return initEvent.event.clientY - event.clientY;
          case 'right':
            return event.clientX - initEvent.event.clientX;
          case 'bottom':
            return event.clientY - initEvent.event.clientY;
          case 'left':
            return initEvent.event.clientX - event.clientX;
        }
      })();
      const size = initEvent.initPosition + diff;
      if (horizontal) {
        context.setHeight(size);
      } else {
        context.setWidth(size);
      }
    };

    const onMouseup = () => {
      setInitEvent(null);
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }
      if (horizontal) {
        context.setHeight(initEvent.initPosition);
      } else {
        context.setWidth(initEvent.initPosition);
      }
      setInitEvent(null);
    };

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup);
    document.addEventListener('keydown', onKeydown);
    document.body.classList.add(horizontal ? 'cursor-row-resize' : 'cursor-col-resize');
    return () => {
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
      document.removeEventListener('keydown', onKeydown);
      document.body.classList.remove(horizontal ? 'cursor-row-resize' : 'cursor-col-resize');
    };
  }, [context, horizontal, initEvent, panePosition]);

  return (
    <div
      {...props}
      className={clsx(
        'tw-absolute',
        'tw-z-50',
        `tw-${panePosition}-0`,
        horizontal ? 'tw-cursor-row-resize' : 'tw-cursor-col-resize',
        horizontal ? 'tw-w-full' : 'tw-h-full',
      )}
      style={{
        [horizontal ? 'height' : 'width']: paneWidth,
      }}
      onMouseDown={(event) =>
        setInitEvent({
          event: event,
          initPosition: horizontal ? context.height : context.width,
        })
      }>
      {children}
    </div>
  );
};

export interface PanelResizerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * @description
   * 패널의 너비 지정
   */
  width?: number;

  /**
   * @description
   * 패널의 최소 너비 지정
   */
  minWidth?: number;

  /**
   * @description
   * 패널의 높이 지정
   */
  height?: number;

  /**
   * @description
   * 패널의 최소 높이 지정
   */
  minHeight?: number;
}

/**
 * @description
 * 리사이즈가 가능한 패널
 * @example
 * <PanelResizer.Panel width={200} minWidth={30}>
 *  <PanelResizer.Pane panePosition="right"></PanelResizer.Pane>
 * </PanelResizer.Panel>
 */
const Panel = ({ children, width, minWidth, height, minHeight, ...props }: PanelResizerProps) => {
  const [state, setState] = useState({
    active: false,
    width: width,
    minWidth: minWidth || 3,
    height: height,
    minHeight: minHeight || 3,
  });

  const setWidth = (width: number) => setState({ ...state, width });

  const setHeight = (height: number) => setState({ ...state, height });

  return (
    <PanelContext.Provider
      value={{
        ...state,
        setWidth,
        setHeight,
      }}>
      <div
        {...props}
        className={clsx('tw-relative', props.className)}
        style={{
          ...props.style,
          width: state.width ? Math.max(state.width, state.minWidth) : undefined,
          height: state.height ? Math.max(state.height, state.minHeight) : undefined,
        }}>
        {children}
      </div>
    </PanelContext.Provider>
  );
};

export const PanelResizer = {
  Panel: Panel,
  Pane: Pane,
};
