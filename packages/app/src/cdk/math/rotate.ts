/**
 * @description
 * 객체 회전 좌표 계산
 *
 * @link https://shihn.ca/posts/2020/resizing-rotated-elements/
 * @param x - origin X
 * @param y - origin Y
 * @param cx - center X
 * @param cy - center Y
 * @param angle rotation angle
 * @returns rotated x, y
 */
export const rotate = (
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number,
): [number, number] => [
  (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle) + cx,
  (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle) + cy,
];
