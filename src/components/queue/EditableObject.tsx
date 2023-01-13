import {
  createContext,
  FunctionComponent,
  ReactNode,
  useLayoutEffect,
  useRef,
  MouseEvent,
} from 'react';
import { Resizer } from '../../cdk/resizer/Resizer';
import { QueueSquare, QueueSquareWithEffect } from '../../model/object/rect';
import { getCurrentFade, WithFadeAnimation } from './animate/fade';
import { getCurrentRect, WithRectAnimation } from './animate/rect';
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
  translate: { x: number; y: number };
  onMousedown?: (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => void;
  object: QueueSquareWithEffect;
}

export const QueueObject: FunctionComponent<QueueObjectProps> = ({
  children,
  object,
  selected,
  index,
  onMousedown,
  position,
  translate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<SVGSVGElement>(null);

  const currentFill = object.fill;
  const currentStroke = object.stroke;
  const currentText = object.text;
  const currentFade = getCurrentFade(object, index);
  const currentRect = getCurrentRect(object, index);

  WithFadeAnimation(containerRef, object, index, position);
  WithRectAnimation(containerRef, object, index, position);

  const onContainerMousedown = (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ): void => {
    if (onMousedown) {
      onMousedown(event);
    }
  };

  useLayoutEffect(() => {
    if (containerRef.current) {
      const element = containerRef.current;
      element.style.left = currentRect.x + 'px';
      element.style.top = currentRect.y + 'px';
      element.style.width = currentRect.width + 'px';
      element.style.height = currentRect.height + 'px';
    }
    if (containerRef.current) {
      const element = containerRef.current;
      element.style.opacity = `${Math.max(currentFade.opacity, 0.1)}`;
    }
  }, [currentRect, currentFade]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseDown={onContainerMousedown}
      style={
        selected
          ? {
              transform: `translate(${translate.x}px, ${translate.y}px)`,
            }
          : {}
      }
    >
      <svg
        ref={objectRef}
        style={{
          width: currentRect.width,
          height: currentRect.height,
        }}
      >
        <g>
          <rect
            x={0}
            y={0}
            width={currentRect.width}
            height={currentRect.height}
            fill={currentFill.color}
            stroke={currentStroke.color}
            strokeWidth={currentStroke.width}
            strokeDasharray={currentStroke.dasharray}
          ></rect>
        </g>
      </svg>
      <div
        className={styles.text}
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
      {selected && (
        <Resizer
          width={currentRect.width}
          height={currentRect.height}
        ></Resizer>
      )}
    </div>
  );
};
