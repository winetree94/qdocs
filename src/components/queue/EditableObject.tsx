import clsx from 'clsx';
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useRef,
  MouseEvent,
} from 'react';
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
  translate: QueueSquareRect;
  scale: number;
  onMousedown?: (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => void;
  onResizerMousedown?: (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
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
  translate,
  scale,
  onMousedown,
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
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ): void => {
    if (onMousedown) {
      onMousedown(event);
    }
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
