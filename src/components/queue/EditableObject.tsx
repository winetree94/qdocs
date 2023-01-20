import clsx from 'clsx';
import {
  createContext,
  FunctionComponent,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  QueueSquare,
  QueueFade,
  QueueFill,
  QueueRect,
  QueueStroke,
  QueueText,
} from '../../model/object/rect';
import { getCurrentFade } from './animate/fade';
import { getCurrentRect } from './animate/rect';
import styles from './EditableObject.module.scss';
import { QueueAnimatableContext } from './QueueAnimation';

export interface QueueObjectContextType {
  to: QueueSquare | null;
  animate: () => void;
  selected: boolean;
  queueObjectStyle: QueueObjectStyle | null;
}

export interface QueueObjectStyle {
  fill: QueueFill;
  storke: QueueStroke;
  text: QueueText;
  fade: QueueFade;
  rect: QueueRect;
}

export const QueueObjectContext = createContext<QueueObjectContextType>({
  to: null,
  animate: () => null,
  selected: false,
  queueObjectStyle: null,
});

export const useQueueObjectContext = (): QueueObjectContextType => {
  const context = useContext(QueueObjectContext);

  if (!context) {
    throw new Error('QueueObjectContextProvider not found!');
  }

  return context;
};

export interface QueueObjectProps {
  start: number;
  position: 'forward' | 'backward' | 'pause';
  index: number;
  children?: ReactNode;
  translate?: QueueRect;
  object: QueueSquare;
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
  const isClickInsideRef = useRef(false);
  const objectRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState(false);

  const currentFill = object.fill;
  const currentStroke = object.stroke;
  const currentText = object.text;
  const fade = getCurrentFade(object, index);

  const currentFade = useMemo(
    () => ({ opacity: Math.max(fade.opacity, 0.1) }),
    [fade.opacity]
  );

  const currentRect = getCurrentRect(object, index);
  const queueObjectStyle = useMemo(
    () => ({
      fill: currentFill,
      storke: currentStroke,
      text: currentText,
      fade: currentFade,
      rect: currentRect,
    }),
    [currentFade, currentFill, currentRect, currentStroke, currentText]
  );

  const queueObjectContextValue = useMemo(
    () => ({
      to: null,
      animate: (): null => null,
      selected,
      queueObjectStyle,
    }),
    [selected, queueObjectStyle]
  );

  useEffect(() => {
    const handleClick = (): void => {
      if (!isClickInsideRef.current) {
        setSelected(false);
      }
      isClickInsideRef.current = false;
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

  return (
    <QueueObjectContext.Provider value={queueObjectContextValue}>
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
        onClick={(): void => setSelected(true)}
        onClickCapture={(): boolean => (isClickInsideRef.current = true)}
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
    </QueueObjectContext.Provider>
  );
};

export const QueueObjectStyler = (): ReactElement | null => {
  const { selected, queueObjectStyle } = useQueueObjectContext();

  if (!selected) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 p-2">
      <p>선택된 오브젝트 있음</p>
      <div>
        <label htmlFor="">
          <span>width</span>
          <input
            type="number"
            name=""
            id=""
            defaultValue={queueObjectStyle?.rect.width}
          />
        </label>
      </div>
      <div>
        <label htmlFor="">
          <span>height</span>
          <input
            type="number"
            name=""
            id=""
            defaultValue={queueObjectStyle?.rect.height}
          />
        </label>
      </div>
      <div>
        <label htmlFor="fill">
          <span>fill color</span>
          <input
            type="color"
            name=""
            id="fill"
            defaultValue={queueObjectStyle?.fill.color}
          />
        </label>
      </div>
      <div>
        <label htmlFor="fill">
          <span>storke color</span>
          <input
            type="color"
            name=""
            id="strokeColor"
            defaultValue={queueObjectStyle?.storke.color}
          />
        </label>
      </div>
      <div>
        <label htmlFor="">
          <span>stroke dasharray</span>
          <select name="" id="">
            <option value={queueObjectStyle?.storke.dasharray}>
              {queueObjectStyle?.storke.dasharray}
            </option>
          </select>
        </label>
      </div>
      <div>
        <label htmlFor="">
          <span>stroke width</span>
          <input
            type="number"
            name=""
            id=""
            defaultValue={queueObjectStyle?.storke.width}
          />
        </label>
      </div>
    </div>
  );
};
