import { createContext, FunctionComponent, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { linear } from './animate';

export const a = 3;

export interface AnimateOptions {
  duration: number;
  timing: (timeFraction: number) => number;
  draw: (progress: number) => void;
}

export const animate = (options: AnimateOptions): number => {
  const start = performance.now();

  const animate = (time: number): void => {
    let timeFraction = (time - start) / options.duration;
    if (timeFraction > 1) timeFraction = 1;
    const progress = options.timing(timeFraction);
    options.draw(progress);
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  };

  return requestAnimationFrame(animate);
};

export const useAnimatedValue = (
  options: AnimateOptions,
): (() => void) => {
  const ref = useRef<number>(0);
  const [start, setStart] = useState<number>(-1);

  const animate = useCallback((time: number): void => {
    let timeFraction = (time - start) / options.duration;
    if (timeFraction > 1) timeFraction = 1;
    const progress = options.timing(timeFraction);
    options.draw(progress);
    if (timeFraction < 1) {
      ref.current = requestAnimationFrame(animate);
    }
  }, [options, start]);

  const startAnimation = (): void => {
    setStart(performance.now());
  };

  return startAnimation;
};

export interface AnimationContextType {
  progress: number;
}

export const AnimatableContext = createContext<number>(-1);

export interface AnimatorProps {
  children: React.ReactNode;
  start: number;
  timing?: 'linear';
  duration?: number;
}

export const Animatable: FunctionComponent<AnimatorProps> = ({
  children,
  start,
  duration = 0,
}: AnimatorProps) => {
  const ref = useRef<number>(0);
  const [progress, setProgress] = useState<number>(-1);

  const animate = useCallback((time: number): void => {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    const progress = linear(timeFraction);
    setProgress(progress);
    if (timeFraction < 1) {
      ref.current = requestAnimationFrame(animate);
    } else {
      setProgress(-1);
    }
  }, [
    start,
    duration,
  ]);

  useLayoutEffect(() => {
    if (!start || start < 0) return;
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [start, animate]);

  return (
    <AnimatableContext.Provider value={progress}>{children}</AnimatableContext.Provider>
  );
};

