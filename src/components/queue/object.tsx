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
} from 'react';
import { useRecoilValue } from 'recoil';
import { animate, linear } from '../../cdk/animation/animate';
import { Resizer } from '../../cdk/resizer/Resizer';
import {
  getSumRect,
  QueueSquare,
  QueueSquareMoveEffect,
  QueueSquareRect,
  QueueSquareWithEffect,
} from '../../model/object/rect';
import { documentSettingsState } from '../../store/settings';

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
  index: number;
  children?: ReactNode;
  object: QueueSquareWithEffect;
}

export interface QueueObjectRef {
  animateRect: (from: QueueSquare) => void;
}

export const Animator: FunctionComponent = () => {
  return <div></div>;
};

export const QueueObject: FunctionComponent<QueueObjectProps> = forwardRef<
  QueueObjectRef,
  QueueObjectProps
>(({ children, object, selected }, ref) => {
  const [frame, setFrame] = useState<number>(0);
  const moveEffect = object.effects.find(
    (effect): effect is QueueSquareMoveEffect => effect.type === 'move'
  );
  const targetObject = getSumRect(object);
  const container = useRef<HTMLDivElement>(null);
  const settings = useRecoilValue(documentSettingsState);
  const targetRect = moveEffect?.rect ?? targetObject.rect;

  const anim = (): void => {
    if (!moveEffect) {
      return;
    }
    if (targetObject === object) {
      return;
    }
    if (!container.current) {
      return;
    }
    cancelAnimationFrame(frame);

    const element = container.current;
    element.style.left = object.rect.x + 'px';
    element.style.top = object.rect.y + 'px';
    element.style.width = object.rect.width + 'px';
    element.style.height = object.rect.height + 'px';

    const createdFrame = animate({
      duration: moveEffect.duration,
      timing: linear,
      draw: (progress) => {
        element.style.left =
          object.rect.x + (moveEffect.rect.x - object.rect.x) * progress + 'px';
        element.style.top =
          object.rect.y + (moveEffect.rect.y - object.rect.y) * progress + 'px';
        element.style.width =
          object.rect.width +
          (moveEffect.rect.width - object.rect.width) * progress +
          'px';
        element.style.height =
          object.rect.width +
          (moveEffect.rect.height - object.rect.height) * progress +
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
    element.style.left = targetRect.x + 'px';
    element.style.top = targetRect.y + 'px';
    element.style.width = targetRect.width + 'px';
    element.style.height = targetRect.height + 'px';
    return () => cancelAnimationFrame(frame);
  });

  useLayoutEffect(() => {
    if (settings.queuePosition === 'forward') {
      anim();
    }
  }, [settings.queueIndex, settings.queuePosition]);

  return (
    <div
      ref={container}
      className={css`
        position: absolute;
        background: red;
      `}
    >
      <div>
        {children}
        {selected && (
          <Resizer
            width={targetRect.width}
            height={targetRect.height}
          ></Resizer>
        )}
      </div>
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
