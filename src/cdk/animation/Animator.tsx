import {
  createContext,
  FunctionComponent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  AnimatorTimingFunctionType,
  getTimingFunction,
} from './timing';

const AnimatableContext = createContext<number>(-1);

export interface AnimatorProps {
  children: (value: number) => React.ReactNode;
  start: number;
  timing?: AnimatorTimingFunctionType;
  duration?: number;
}

export const Animator: FunctionComponent<AnimatorProps> = ({
  children,
  start,
  timing = 'linear',
  duration = 0,
}: AnimatorProps) => {
  const now = performance.now();
  const actived = (now - start) / duration < 1;

  const ref = useRef<number>(0);
  const [progress, setProgress] = useState<number>(-1);

  const animate = useCallback((time: number): void => {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    const progress = getTimingFunction(timing)(timeFraction);
    setProgress(progress);
    if (timeFraction < 1) {
      ref.current = requestAnimationFrame(animate);
    } else {
      setProgress(-1);
    }
  }, [
    start,
    duration,
    timing,
  ]);

  useLayoutEffect(() => {
    if (!start || start < 0) return;
    setProgress(0);
    ref.current = requestAnimationFrame(animate);
    return () => {
      setProgress(-1);
      cancelAnimationFrame(ref.current);
    };
  }, [
    start,
    animate,
  ]);

  return (
    <AnimatableContext.Provider value={actived ? Math.max(progress, 0) : progress}>
      <AnimatableContext.Consumer>
        {children}
      </AnimatableContext.Consumer>
    </AnimatableContext.Provider>
  );
};

