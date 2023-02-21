/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

export const useIsMounted = (): React.MutableRefObject<boolean> => {
  const isMounted = React.useRef(false);

  React.useEffect(function setIsMounted() {
    isMounted.current = true;

    return function cleanupSetIsMounted() {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};

export const useUpdateEffect = (effect: React.EffectCallback, dependencies: React.DependencyList | undefined): void => {
  const isMounted = useIsMounted();
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    let effectCleanupFunc = (): void => undefined;
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effectCleanupFunc = effect() || effectCleanupFunc;
    }
    return () => {
      effectCleanupFunc();
      if (!isMounted.current) {
        isInitialMount.current = true;
      }
    };
  }, dependencies);
};
