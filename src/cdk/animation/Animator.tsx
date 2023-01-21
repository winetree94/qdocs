import {
  createContext,
  FunctionComponent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  getTimingFunction,
} from './timing';

const AnimatableContext = createContext<number>(-1);

export interface AnimatorProps {
  children: (value: number) => React.ReactNode;
  start: number;
  timing?: 'linear';
  duration?: number;
}

export const Animator: FunctionComponent<AnimatorProps> = ({
  children,
  start,
  timing = 'linear',
  duration = 0,
}: AnimatorProps) => {
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
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [start, animate]);

  return (
    <AnimatableContext.Provider value={progress}>
      <AnimatableContext.Consumer>
        {children}
      </AnimatableContext.Consumer>
    </AnimatableContext.Provider>
  );
};

