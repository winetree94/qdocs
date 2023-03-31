export const bounce = (timeFraction: number): number => {
  // 튕기는 횟수
  const n1 = 7.5625;

  // 튕길때 마다 줄어드는 속도 제어
  const d1 = 2.75;
  let result = 0;

  if (timeFraction < 1 / d1) {
    result = n1 * timeFraction * timeFraction;
  } else if (timeFraction < 2 / d1) {
    result = n1 * (timeFraction -= 1.5 / d1) * timeFraction + 0.75;
  } else if (timeFraction < 2.5 / d1) {
    result = n1 * (timeFraction -= 2.25 / d1) * timeFraction + 0.9375;
  } else {
    result = n1 * (timeFraction -= 2.625 / d1) * timeFraction + 0.984375;
  }
  return result;
};
