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
import { usePrevious } from '../../cdk/hooks/use-previous';
import { QueueSquare } from '../../model/object/rect';
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
  children?: ReactNode;
  object: QueueSquare;
}

export interface QueueObjectRef {
  animateRect: (from: QueueSquare) => void;
}

export const QueueObject: FunctionComponent<QueueObjectProps> = forwardRef<
  QueueObjectRef,
  QueueObjectProps
>(({ children, object }, ref) => {
  const [frame, setFrame] = useState<number>(0);
  const container = useRef<HTMLDivElement>(null);
  const previous = usePrevious(object);
  const index = useRecoilValue(documentSettingsState).queueIndex;

  useLayoutEffect(() => {
    if (!container.current) {
      return;
    }
    const element = container.current;
    element.style.left = object.rect.x + 'px';
    element.style.top = object.rect.y + 'px';
    element.style.width = object.rect.width + 'px';
    element.style.height = object.rect.height + 'px';
    return () => cancelAnimationFrame(frame);
  });

  const anim = (from: QueueSquare): void => {
    if (!container.current) {
      return;
    }

    cancelAnimationFrame(frame);

    const element = container.current;
    element.style.left = from.rect.x + 'px';
    element.style.top = from.rect.y + 'px';
    element.style.width = from.rect.width + 'px';
    element.style.height = from.rect.height + 'px';

    const createdFrame = animate({
      duration: 1000,
      timing: linear,
      draw: (progress) => {
        element.style.left = object.rect.x * progress + 'px';
        element.style.top = object.rect.y * progress + 'px';
        element.style.width =
          from.rect.width +
          (object.rect.width - from.rect.width) * progress +
          'px';
        element.style.height =
          from.rect.width +
          (object.rect.height - from.rect.height) * progress +
          'px';
      },
    });

    setFrame(createdFrame);
  };

  useLayoutEffect(() => {
    if (!previous) {
      return;
    }
    anim(previous);
  }, [index, previous, object]);

  return (
    <QueueObjectContext.Provider
      value={{
        to: null,
        animate: () => null,
      }}
    >
      <div
        ref={container}
        className={css`
          position: absolute;
          background: red;
        `}
      >
        {children}
      </div>
    </QueueObjectContext.Provider>
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
