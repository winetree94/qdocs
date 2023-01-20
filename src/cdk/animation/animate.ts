export const pendingAnimations = [];

export interface AnimateOptions {
  duration: number;
  timing: (timeFraction: number) => number;
  draw: (progress: number) => void;
}

export const animate = (options: AnimateOptions): number => {
  const start = performance.now();
  return requestAnimationFrame(function animate(time: number) {
    let timeFraction = (time - start) / options.duration;
    if (timeFraction > 1) timeFraction = 1;
    const progress = options.timing(timeFraction);
    options.draw(progress);
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
};

export const linear = (timeFraction: number): number => {
  return timeFraction;
};

export const makeEaseOut = (timing: (timeFraction: number) => number) => {
  return (timeFraction: number): number => {
    return 1 - timing(1 - timeFraction);
  };
};

export function quad(timeFraction: number): number {
  return Math.pow(timeFraction, 2);
}
