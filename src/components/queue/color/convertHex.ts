export const toHex = (number: number): string => {
  return number.toString(16).padStart(2, '0');
};

export const convertHexWithOpacity = (color: string, opacity: number): string => {
  return color + toHex(Math.round(opacity * 255));
};

/**
 * @description
 * hex color를 RGB로 변환
 * @return [R, G, B]
 */
export const hexToRgb = (hex: string): readonly [number, number, number] => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullFormHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullFormHex);

  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

/**
 * @description
 * RGB를 hex color로 변환
 */
export const rgbToFullFormHex = (r: number, g: number, b: number): string => {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
};
