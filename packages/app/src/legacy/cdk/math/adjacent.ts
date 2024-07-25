export const adjacent = (n: number, adjacent: number): number => {
  return Math.round(n / adjacent) * adjacent;
};
