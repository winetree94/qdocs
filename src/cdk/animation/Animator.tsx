import { isEqual } from 'lodash';
import { createContext, useCallback, useLayoutEffect, useReducer, useRef } from 'react';
import { AnimatorTimingFunctionType, getTimingFunction } from './timing';

const AnimatorsContext = createContext<number[]>([]);

export interface AnimatorsProps {
  children?: (values: number[]) => React.ReactNode;
  start?: number;
  animations: {
    timing?: AnimatorTimingFunctionType;
    duration: number;
  }[];
}

const reducer = (previous: number[], current: number[]) => {
  return isEqual(previous, current) ? previous : current;
};

export const Animators = ({ start, animations, children }: AnimatorsProps) => {
  const frameRef = useRef<number>(-1);
  const [progresses, setProgresses] = useReducer(reducer, []);

  const calculateProgress = useCallback(
    (time: number) => {
      const currentProgresses = animations.map(({ duration = 0, timing = 'linear' }) => {
        const timeFraction = (time - start) / duration;
        const progress = getTimingFunction(timing)(timeFraction);
        return Math.max(Math.min(1, progress), 0);
      });
      return currentProgresses;
    },
    [animations, start],
  );

  const animate = useCallback(
    (time: number) => {
      const currentProgresses = calculateProgress(time);
      setProgresses(currentProgresses);
      if (Math.min(...currentProgresses) < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    },
    [calculateProgress],
  );

  useLayoutEffect(() => {
    setProgresses(calculateProgress(performance.now()).map((progress) => (progress === 1 ? 1 : 0)));
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [animate, calculateProgress]);

  return (
    <AnimatorsContext.Provider value={progresses}>
      <AnimatorsContext.Consumer>{children}</AnimatorsContext.Consumer>
    </AnimatorsContext.Provider>
  );
};
