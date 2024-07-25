import { AnimatorTimingFunctionType } from '@legacy/cdk/animation/timing/meta';
import { isEqual } from 'lodash';
import {
  createContext,
  useCallback,
  useLayoutEffect,
  useReducer,
  useRef,
} from 'react';
import { getTimingFunction } from './timing';

const AnimatorsContext = createContext<number[]>([]);

export interface AnimatorsProps {
  children?: (values: number[]) => React.ReactNode;

  /**
   * @description
   * 애니메이션의 시작 시간
   * 일반적으로 performance.now() 를 사용
   */
  start?: number;

  /**
   * @description
   * 애니메이션 정보
   */
  animations: {
    /**
     * @description
     * 애니메이션의 시작 시간 이후 지연시킬 시간 (ms)
     */
    delay?: number;

    /**
     * @description
     * 애니메이션 시작 시간으로부터 진행 시간에 따른 진행률을 지정할 함수 종류
     */
    timing?: AnimatorTimingFunctionType;

    /**
     * @description
     * 애니메이션의 시작 시간부터 지속시킬 시간 (ms)
     */
    duration?: number;
  }[];
}

const reducer = (previous: number[], current: number[]) => {
  return isEqual(previous, current) ? previous : current;
};

/**
 * 애니메이션을 표현하기 위해 사용하는 컴포넌트
 * 선언된 애니메이션은 start(현재 시간)의 시점에 따라 0 ~ 1 의 진행률로 전달됩니다.
 *
 * @link
 * https://javascript.info/js-animation
 */
export const Animators = ({ start, animations, children }: AnimatorsProps) => {
  const frameRef = useRef<number>(-1);
  const [progresses, setProgresses] = useReducer(reducer, []);

  const calculateProgress = useCallback(
    (time: number) => {
      const currentProgresses = animations.map(
        ({ duration = 0, delay = 1000, timing = 'linear' }) => {
          const delayedTimeFraction = (time - start) / delay;
          if (delayedTimeFraction < 1) return 0;
          const animationTimeFraction = (time - start - delay) / duration;
          const progress = getTimingFunction(timing)(animationTimeFraction);
          return Math.max(Math.min(1, progress), 0);
        },
      );
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
    setProgresses(
      calculateProgress(performance.now()).map((progress) =>
        progress === 1 ? 1 : 0,
      ),
    );
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [animate, calculateProgress]);

  return (
    <AnimatorsContext.Provider value={progresses}>
      <AnimatorsContext.Consumer>{children}</AnimatorsContext.Consumer>
    </AnimatorsContext.Provider>
  );
};
