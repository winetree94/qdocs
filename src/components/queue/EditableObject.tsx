import {
  createContext,
  FunctionComponent,
  ReactNode,
  useRef,
  MouseEvent,
} from 'react';
import { Resizer } from '../../cdk/resizer/Resizer';
import { QueueSquare, QueueSquareWithEffect } from '../../model/object/rect';
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
  translate: { x: number; y: number };
  onMousedown?: (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => void;
  object: QueueSquareWithEffect;
}

export const QueueObject: FunctionComponent<QueueObjectProps> = ({
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
      className={styles.container}
      onMouseDown={onContainerMousedown}
      style={{
        top: `${currentRect.y}px`,
        left: `${currentRect.x}px`,
        width: `${currentRect.width}px`,
        height: `${currentRect.height}px`,
        opacity: `${currentFade.opacity}`,
        transform: selected
          ? `translate(${translate.x}px, ${translate.y}px)`
          : '',
      }}
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
