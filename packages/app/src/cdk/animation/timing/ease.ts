export const ease = (timeFraction: number): number => {
  return timeFraction < 0.5
    ? 4 * timeFraction * timeFraction * timeFraction
    : (timeFraction - 1) * (2 * timeFraction - 2) * (2 * timeFraction - 2) + 1;
};
