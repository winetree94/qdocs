export const center = (
  x: number,
  y: number,
  width: number,
  height: number,
): [number, number] => {
  return [x + width / 2, y + height / 2];
};