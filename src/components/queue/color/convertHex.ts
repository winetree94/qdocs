export const convertHex = (color: string, opacity: number): string => {
  if (opacity <= 0) {
    return color + '00';
  }

  return color + Math.round(opacity * 255).toString(16);
};
