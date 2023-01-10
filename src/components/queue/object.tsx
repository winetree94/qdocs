/* eslint-disable @typescript-eslint/no-unused-vars */
import { css } from '@emotion/css';
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useLayoutEffect,
  useState,
  useRef,
  forwardRef,
  MouseEvent,
} from 'react';
import { useRecoilValue } from 'recoil';
import { animate, linear } from '../../cdk/animation/animate';
import { Resizer } from '../../cdk/resizer/Resizer';
import {
  QueueSquare,
  QueueSquareMoveEffect,
  QueueSquareRect,
  QueueSquareWithEffect,
} from '../../model/object/rect';
import { documentSettingsState } from '../../store/settings';
import styles from './Object.module.scss';

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
  animateRect: (from: QueueSquare) => void;
}

export const Animator: FunctionComponent = () => {
  return <div></div>;
};

export const getCurrentRect = (
  object: QueueSquareWithEffect,
  index: number
): QueueSquareRect => {
  return object.effects
    .filter((effect) => effect.index <= index)
    .filter((effect): effect is QueueSquareMoveEffect => effect.type === 'move')
    .reduce<QueueSquareRect>((_, effect) => effect.rect, object.rect);
};

export const getFromRect = (
  object: QueueSquareWithEffect,
  index: number,
  position: 'forward' | 'backward' | 'pause'
): QueueSquareRect => {
  switch (position) {
    case 'forward':
      return getCurrentRect(object, index - 1);
    case 'backward':
      return getCurrentRect(object, index + 1);
    default:
      return getCurrentRect(object, index);
  }
};

export const QueueObject: FunctionComponent<QueueObjectProps> = forwardRef<
  QueueObjectRef,
  QueueObjectProps
>(({ children, object, selected, index, onMousedown, position }, ref) => {
  const [frame, setFrame] = useState<number>(0);
  const currentRect = getCurrentRect(object, index);
  const fromRect = getFromRect(object, index, position);
  const container = useRef<HTMLDivElement>(null);
  const settings = useRecoilValue(documentSettingsState);

  const onContainerMousedown = (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ): void => {
    if (onMousedown) {
      onMousedown(event);
    }
  };

  const anim = (): void => {
    if (!container.current) {
      return;
    }
    cancelAnimationFrame(frame);

    const element = container.current;
    element.style.left = fromRect.x + 'px';
    element.style.top = fromRect.y + 'px';
    element.style.width = fromRect.width + 'px';
    element.style.height = fromRect.height + 'px';

    const createdFrame = animate({
      duration: 1000,
      timing: linear,
      draw: (progress) => {
        element.style.left =
          fromRect.x + (currentRect.x - fromRect.x) * progress + 'px';
        element.style.top =
          fromRect.y + (currentRect.y - fromRect.y) * progress + 'px';
        element.style.width =
          fromRect.width +
          (currentRect.width - fromRect.width) * progress +
          'px';
        element.style.height =
          fromRect.width +
          (currentRect.height - fromRect.height) * progress +
          'px';
      },
    });

    setFrame(createdFrame);
  };

  useLayoutEffect(() => {
    if (!container.current) {
      return;
    }
    const element = container.current;
    element.style.left = currentRect.x + 'px';
    element.style.top = currentRect.y + 'px';
    element.style.width = currentRect.width + 'px';
    element.style.height = currentRect.height + 'px';
    return () => cancelAnimationFrame(frame);
  }, [currentRect, frame]);

  useLayoutEffect(() => {
    anim();
  }, [settings.queueIndex, settings.queuePosition]);

  return (
    <div
      ref={container}
      className={styles.container}
      onMouseDown={onContainerMousedown}
    >
      <div className={styles.object}></div>
      <div className={styles.text}>{children}</div>
      {selected && (
        <Resizer
          width={currentRect.width}
          height={currentRect.height}
        ></Resizer>
      )}
    </div>
  );
});

export interface QueueSquareObjectProps {
  children: ReactNode;
}

export const QueueSquareObject: FunctionComponent<QueueSquareObjectProps> = ({
  children,
}) => {
  return <div>{children}</div>;
};
