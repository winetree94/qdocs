import clsx from 'clsx';
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useRef,
} from 'react';
import { QueueSquare, QueueRect } from '../../model/object/rect';
import { QueueAnimatableContext } from './QueueAnimation';
import styles from './EditableObject.module.scss';
import { QueueObjectType } from 'model/document';

export interface QueueObjectContextType {
  to: QueueSquare | null;
  animate: () => void;
}

export const QueueObjectContext = createContext<QueueObjectContextType>({
  to: null,
  animate: () => null,
});

export const useQueueObjectContext = (): QueueObjectContextType => {
  const context = useContext(QueueObjectContext);

  if (!context) {
    throw new Error('QueueObjectContextProvider not found!');
  }

  return context;
};

export interface QueueObjectProps {
  position: 'forward' | 'backward' | 'pause';
  index: number;
  children?: ReactNode;
  translate?: QueueRect;
  object: QueueObjectType;
}

export const LegacyQueueObject: FunctionComponent<QueueObjectProps> = ({
  children,
  object,
  index,
  translate = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
}) => {
  const meta = useContext(QueueAnimatableContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<SVGSVGElement>(null);

  const currentFill = object.fill;
  const currentStroke = object.stroke;
  const currentText = object.text;

  return (
    <div
      ref={containerRef}
      className={clsx('object-container', styles.container)}
      style={{
        top: `${meta.rect.y}px`,
        left: `${meta.rect.x}px`,
        width: `${meta.rect.width + translate.width}px`,
        height: `${meta.rect.height + translate.height}px`,
        transform: `translate(${translate.x}px, ${translate.y}px)`,
      }}
    >
      <div
        className="object-shape"
        style={{
          width: `${meta.rect.width + translate.width}px`,
          height: `${meta.rect.height + translate.height}px`,
          opacity: `${meta.fade.opacity}`,
        }}
      >
        <svg
          className="object-rect"
          ref={objectRef}
          width={meta.rect.width + translate.width}
          height={meta.rect.height + translate.height}
        >
          <g>
            <rect
              x={0}
              y={0}
              width={meta.rect.width + translate.width}
              height={meta.rect.height + translate.height}
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
      {children}
    </div>
  );
};
