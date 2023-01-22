export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => ReturnType<F>) => {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }

    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};
