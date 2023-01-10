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

export const getAnimationTargetEffect = (
  object: QueueSquareWithEffect,
  index: number,
  position: 'forward' | 'backward' | 'pause'
): QueueSquareMoveEffect | null => {
  if (position === 'pause') {
    return null;
  }

  if (position === 'forward') {
    return (
      object.effects.find(
        (effect): effect is QueueSquareMoveEffect =>
          effect.type === 'move' && effect.index === index
      ) || null
    );
  }

  return object.effects
    .filter((effect) => effect.index <= index + 1)
    .filter((effect): effect is QueueSquareMoveEffect => effect.type === 'move')
    .reduce<QueueSquareMoveEffect | null>((_, effect) => effect, null);
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

export interface AnimateModel {
  fromRect: QueueSquareRect;
  moveEffect: QueueSquareMoveEffect;
}

export const getAnimateModel = (
  object: QueueSquareWithEffect,
  index: number,
  position: 'forward' | 'backward' | 'pause'
): AnimateModel | null => {
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

export const QueueObject: FunctionComponent<QueueObjectProps> = forwardRef<
  QueueObjectRef,
  QueueObjectProps
>(({ children, object, selected, index, onMousedown, position }, ref) => {
  const [frame, setFrame] = useState<number>(0);
  const currentRect = getCurrentRect(object, index);
  const animateModel = getAnimateModel(object, index, position);
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
    if (!animateModel) {
      return;
    }
    if (!container.current) {
      return;
    }
    cancelAnimationFrame(frame);

    const element = container.current;
    element.style.left = animateModel.fromRect.x + 'px';
    element.style.top = animateModel.fromRect.y + 'px';
    element.style.width = animateModel.fromRect.width + 'px';
    element.style.height = animateModel.fromRect.height + 'px';

    const createdFrame = animate({
      duration: animateModel.moveEffect.duration,
      timing: linear,
      draw: (progress) => {
        element.style.left =
          animateModel.fromRect.x +
          (animateModel.moveEffect.rect.x - animateModel.fromRect.x) *
            progress +
          'px';
        element.style.top =
          animateModel.fromRect.y +
          (animateModel.moveEffect.rect.y - animateModel.fromRect.y) *
            progress +
          'px';
        element.style.width =
          animateModel.fromRect.width +
          (animateModel.moveEffect.rect.width - animateModel.fromRect.width) *
            progress +
          'px';
        element.style.height =
          animateModel.fromRect.width +
          (animateModel.moveEffect.rect.height - animateModel.fromRect.height) *
            progress +
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
