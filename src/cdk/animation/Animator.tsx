import { AnimatorTimingFunctionType } from 'cdk/animation/timing/meta';
import { isEqual } from 'lodash';
import { createContext, useCallback, useLayoutEffect, useReducer, useRef } from 'react';
import { getTimingFunction } from './timing';

const AnimatorsContext = createContext<number[]>([]);

export interface AnimatorsProps {
  children?: (values: number[]) => React.ReactNode;
  start?: number;
  animations: {
    delay?: number;
    timing?: AnimatorTimingFunctionType;
    duration?: number;
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
      const currentProgresses = animations.map(({ duration = 0, delay = 1000, timing = 'linear' }) => {
        const delayedTimeFraction = (time - start) / delay;
        if (delayedTimeFraction < 1) return 0;
        const animationTimeFraction = (time - start - delay) / duration;
        const progress = getTimingFunction(timing)(animationTimeFraction);
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
    // requestAnimationFrame 이 렌더링 사이클보다 늦게 실행되기 때문에, 즉시 반영
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
