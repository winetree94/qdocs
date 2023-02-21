export const angle = (cx: number, cy: number, ex: number, ey: number): number => {
  const dy = ey - cy;
  const dx = ex - cx;
  let theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  return theta;
};
