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
  DependencyList,
} from 'react';
import { useRecoilValue } from 'recoil';
import { animate, linear } from '../../cdk/animation/animate';
import { Resizer } from '../../cdk/resizer/Resizer';
import {
  QueueSquare,
  QueueSquareFade,
  QueueSquareFadeEffect,
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

export const getCurrentFade = (
  object: QueueSquareWithEffect,
  index: number
): QueueSquareFade => {
  return object.effects
    .filter((effect) => effect.index <= index)
    .filter((effect): effect is QueueSquareFadeEffect => effect.type === 'fade')
    .reduce<QueueSquareFade>((_, effect) => effect.fade, object.fade);
};

export const getFromRect = (
  object: QueueSquareWithEffect,
  index: number,
  position: 'forward' | 'backward' | 'pause'
): QueueSquareMoveEffect | null => {
  switch (position) {
    case 'forward':
      return (
        object.effects.find(
          (effect): effect is QueueSquareMoveEffect =>
            effect.index === index && effect.type === 'move'
        ) || null
      );
    case 'backward':
      return (
        object.effects.find(
          (effect): effect is QueueSquareMoveEffect =>
            effect.index === index + 1 && effect.type === 'move'
        ) || null
      );
    default:
      return null;
  }
};

export interface RectAnimation {
  fromRect: QueueSquareRect;
  moveEffect: QueueSquareMoveEffect;
}

export const getRectAnimation = (
  object: QueueSquareWithEffect,
  index: number,
  position: 'forward' | 'backward' | 'pause'
): RectAnimation | null => {
  if (position === 'pause') {
    return null;
  }

  const fromRect = getCurrentRect(
    object,
    position === 'forward' ? index - 1 : index + 1
  );

  const moveEffect = object.effects.find(
    (effect): effect is QueueSquareMoveEffect => {
      const targetIndex = position === 'forward' ? index : index + 1;
      return effect.index === targetIndex && effect.type === 'move';
    }
  );

  if (!moveEffect) {
    return null;
  }

  const slicedEffect: QueueSquareMoveEffect =
    position === 'backward'
      ? {
          ...moveEffect,
          rect: {
            ...getCurrentRect(object, index),
          },
        }
      : moveEffect;

  return {
    fromRect: fromRect,
    moveEffect: slicedEffect,
  };
};

export interface FadeAnimation {
  fromFade: QueueSquareFade;
  fadeEffect: QueueSquareFadeEffect;
}

export const getFadeAnimation = (
  object: QueueSquareWithEffect,
  index: number,
  position: 'forward' | 'backward' | 'pause'
): FadeAnimation | null => {
  if (position === 'pause') {
    return null;
  }

  const fromFade = getCurrentFade(
    object,
    position === 'forward' ? index - 1 : index + 1
  );

  const fadeEffect = object.effects.find(
    (effect): effect is QueueSquareFadeEffect => {
      const targetIndex = position === 'forward' ? index : index + 1;
      return effect.index === targetIndex && effect.type === 'fade';
    }
  );

  if (!fadeEffect) {
    return null;
  }

  const slicedEffect: QueueSquareFadeEffect =
    position === 'backward'
      ? {
          ...fadeEffect,
          fade: {
            ...getCurrentFade(object, index),
          },
        }
      : fadeEffect;

  return {
    fromFade: fromFade,
    fadeEffect: slicedEffect,
  };
};

const useAnimate = (callback: () => void, deps: DependencyList): void => {
  const ref = useRef<number>(0);
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      callback();
    });
    ref.current = frame;
    return () => cancelAnimationFrame(ref.current);
  }, [callback]);
};

export const QueueObject: FunctionComponent<QueueObjectProps> = forwardRef<
  QueueObjectRef,
  QueueObjectProps
>(({ children, object, selected, index, onMousedown, position }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);

  const [rectFrame, setRectFrame] = useState<number>(0);
  const [fadeFrame, setFadeFrame] = useState<number>(0);
  const currentFade = getCurrentFade(object, index);
  const currentRect = getCurrentRect(object, index);

  const rectAnimation = getRectAnimation(object, index, position);
  const fadeAnimation = getFadeAnimation(object, index, position);
  const settings = useRecoilValue(documentSettingsState);

  const onContainerMousedown = (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ): void => {
    if (onMousedown) {
      onMousedown(event);
    }
  };

  const animateRect = (): void => {
    cancelAnimationFrame(rectFrame);
    if (!rectAnimation) {
      return;
    }
    if (!containerRef.current) {
      return;
    }

    const element = containerRef.current;
    element.style.left = rectAnimation.fromRect.x + 'px';
    element.style.top = rectAnimation.fromRect.y + 'px';
    element.style.width = rectAnimation.fromRect.width + 'px';
    element.style.height = rectAnimation.fromRect.height + 'px';

    const createdFrame = animate({
      duration: rectAnimation.moveEffect.duration,
      timing: linear,
      draw: (progress) => {
        element.style.left =
          rectAnimation.fromRect.x +
          (rectAnimation.moveEffect.rect.x - rectAnimation.fromRect.x) *
            progress +
          'px';
        element.style.top =
          rectAnimation.fromRect.y +
          (rectAnimation.moveEffect.rect.y - rectAnimation.fromRect.y) *
            progress +
          'px';
        element.style.width =
          rectAnimation.fromRect.width +
          (rectAnimation.moveEffect.rect.width - rectAnimation.fromRect.width) *
            progress +
          'px';
        element.style.height =
          rectAnimation.fromRect.width +
          (rectAnimation.moveEffect.rect.height -
            rectAnimation.fromRect.height) *
            progress +
          'px';
      },
    });

    setRectFrame(createdFrame);
  };

  const animateFade = (): void => {
    cancelAnimationFrame(fadeFrame);
    if (!fadeAnimation) {
      return;
    }
    if (!objectRef.current) {
      return;
    }

    const element = objectRef.current;
    element.style.opacity = `${fadeAnimation.fromFade.opacity}`;

    const createdFrame = animate({
      duration: fadeAnimation.fadeEffect.duration,
      timing: linear,
      draw: (progress) => {
        element.style.opacity =
          fadeAnimation.fromFade.opacity +
          (fadeAnimation.fadeEffect.fade.opacity -
            fadeAnimation.fromFade.opacity) *
            progress +
          '';
      },
    });

    setFadeFrame(createdFrame);
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
    return () => cancelAnimationFrame(rectFrame);
  }, [currentRect, rectFrame, currentFade]);

  useLayoutEffect(() => {
    animateRect();
    animateFade();
  }, [settings.queueIndex, settings.queuePosition]);

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
});

export interface QueueSquareObjectProps {
  children: ReactNode;
}

export const QueueSquareObject: FunctionComponent<QueueSquareObjectProps> = ({
  children,
}) => {
  return <div>{children}</div>;
};
