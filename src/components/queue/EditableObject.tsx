import clsx from 'clsx';
import { createContext, FunctionComponent, ReactNode, useRef } from 'react';
import { Resizer } from '../../cdk/resizer/Resizer';
import { QueueSquare, QueueSquareRect } from '../../model/object/rect';
import { WithFadeAnimation } from './animate/fade';
import { WithRectAnimation } from './animate/rect';
import styles from './EditableObject.module.scss';

export interface QueueObjectContextType {
  to: QueueSquare | null;
  animate: () => void;
}

export const QueueObjectContext = createContext<QueueObjectContextType>({
  to: null,
  animate: () => null,
});

export interface QueueObjectProps {
  selected?: boolean;
  position: 'forward' | 'backward' | 'pause';
  index: number;
  children?: ReactNode;
  translate?: QueueSquareRect;
  scale: number;
  onMousedown?: (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => void;
  onDraggingStart?: (initEvent: MouseEvent, event: MouseEvent) => void;
  onDraggingMove?: (initEvent: MouseEvent, event: MouseEvent) => void;
  onDraggingEnd?: (initEvent: MouseEvent, event: MouseEvent) => void;
  onResizerMousedown?: (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => void;
  onResizeStart?: (event: QueueSquareRect, cancel: () => void) => void;
  onResizeMove?: (event: QueueSquareRect, cancel: () => void) => void;
  onResizeEnd?: (event: QueueSquareRect) => void;
  object: QueueSquare;
}

export const QueueObject: FunctionComponent<QueueObjectProps> = ({
  object,
  selected,
  index,
  position,
  translate = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  scale,
  onMousedown,
  onDraggingStart,
  onDraggingMove,
  onDraggingEnd,
  onResizerMousedown,
  onResizeStart,
  onResizeMove,
  onResizeEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<SVGSVGElement>(null);

  const currentFill = object.fill;
  const currentStroke = object.stroke;
  const currentText = object.text;
  const currentFade = WithFadeAnimation(object, index, position);
  const currentRect = WithRectAnimation(object, index, position);

  const onContainerMousedown = (
    initEvent: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ): void => {
    if (onMousedown) {
      onMousedown(initEvent);
    }

    const onMove = (event: MouseEvent): void => {
      if (onDraggingMove) {
        onDraggingMove(initEvent.nativeEvent, event);
      }
    };

    const checkOnMove = (event: MouseEvent): void => {
      if (
        Math.abs(event.clientX - initEvent.clientX) >= 3 ||
        Math.abs(event.clientY - initEvent.clientY) >= 3
      ) {
        if (onDraggingStart) {
          onDraggingStart(initEvent.nativeEvent, event);
        }
        document.removeEventListener('mousemove', checkOnMove);
        document.addEventListener('mousemove', onMove);
      }
    };

    const onUp = (event: MouseEvent): void => {
      if (onDraggingEnd) {
        onDraggingEnd(initEvent.nativeEvent, event);
      }
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mousemove', checkOnMove);
    };

    document.addEventListener('mousemove', checkOnMove);
    document.addEventListener('mouseup', onUp);
  };

  return (
    <div
      ref={containerRef}
      className={clsx('object-container', styles.container)}
      onMouseDown={onContainerMousedown}
      style={{
        top: `${currentRect.y}px`,
        left: `${currentRect.x}px`,
        width: `${currentRect.width + translate.width}px`,
        height: `${currentRect.height + translate.height}px`,
        transform: `translate(${translate.x}px, ${translate.y}px)`,
      }}
    >
      <div
        className="object-shape"
        style={{
          width: `${currentRect.width + translate.width}px`,
          height: `${currentRect.height + translate.height}px`,
          opacity: `${currentFade.opacity}`,
        }}
      >
        <svg
          className="object-rect"
          ref={objectRef}
          width={currentRect.width + translate.width}
          height={currentRect.height + translate.height}
        >
          <g>
            <rect
              x={0}
              y={0}
              width={currentRect.width + translate.width}
              height={currentRect.height + translate.height}
              fill={currentFill.color}
              stroke={currentStroke.color}
              strokeWidth={currentStroke.width}
              strokeDasharray={currentStroke.dasharray}
            ></rect>
          </g>
        </svg>
        <div
          className={clsx('object-text', styles.text)}
          style={{
            justifyContent: currentText.verticalAlign,
            alignItems: currentText.horizontalAlign,
            fontFamily: currentText.fontFamily,
            color: currentText.fontColor,
            fontSize: currentText.fontSize,
          }}
        >
          {currentText.text}
        </div>
      </div>
      {selected && (
        <Resizer
          rect={{
            x: currentRect.x + translate.x,
            y: currentRect.y + translate.y,
            width: currentRect.width + translate.width,
            height: currentRect.height + translate.height,
          }}
          scale={scale}
          onResizeStart={onResizeStart}
          onResizeMove={onResizeMove}
          onResizeEnd={onResizeEnd}
        ></Resizer>
      )}
    </div>
  );
};
