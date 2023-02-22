import { useEffect } from 'react';

export const useResizeObserver = (ref: React.RefObject<HTMLElement>, callback: ResizeObserverCallback): void => {
  useEffect(() => {
    if (ref.current) {
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [callback, ref]);
};
