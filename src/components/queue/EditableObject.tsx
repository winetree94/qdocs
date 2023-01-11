import {
  createContext,
  FunctionComponent,
  ReactNode,
  useLayoutEffect,
  useRef,
  forwardRef,
  MouseEvent,
  useImperativeHandle,
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
  onMousedown?: (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => void;
  object: QueueSquareWithEffect;
}

export interface QueueObjectRef {
  animate: () => void;
}

export const QueueObject = forwardRef<QueueObjectRef, QueueObjectProps>(
  ({ children, object, selected, index, onMousedown, position }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const objectRef = useRef<HTMLDivElement>(null);

    const currentFade = getCurrentFade(object, index);
    const currentRect = getCurrentRect(object, index);

    WithFadeAnimation(objectRef, object, index, position);
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
      if (objectRef.current) {
        const element = objectRef.current;
        element.style.opacity = `${currentFade.opacity}`;
      }
    }, [currentRect, currentFade]);

    useImperativeHandle(ref, () => ({
      animate: (): void => {
        // animateRect();
        // animateFade();
      },
    }));

    return (
      <div
        ref={containerRef}
        className={styles.container}
        onMouseDown={onContainerMousedown}
      >
        <div
          ref={objectRef}
          style={{
            background: 'red',
            width: '100%',
            height: '100%',
          }}
        >
          <div className={styles.object}></div>
          <div className={styles.text}>{children}</div>
        </div>
        {selected && (
          <Resizer
            width={currentRect.width}
            height={currentRect.height}
          ></Resizer>
        )}
      </div>
    );
  }
);

export interface QueueSquareObjectProps {
  children: ReactNode;
}

export const QueueSquareObject: FunctionComponent<QueueSquareObjectProps> = ({
  children,
}) => {
  return <div>{children}</div>;
};
