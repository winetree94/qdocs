export const easeOut = (timeFraction: number): number => {
  return timeFraction * (2 - timeFraction);
};
