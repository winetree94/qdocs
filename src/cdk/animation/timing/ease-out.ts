export const easeOut = (timing: (timeFraction: number) => number) => {
  return (timeFraction: number): number => {
    return 1 - timing(1 - timeFraction);
  };
};
