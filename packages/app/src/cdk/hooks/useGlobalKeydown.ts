import { disableGlobalKeyDownElement } from '@legacy/cdk/functions/disableGlobalKeyDownElement';
import { useCallback, useEffect } from 'react';

export interface UseGlobalKeydownProps {
  keys?: {
    keys: string[];
    meta?: boolean;
    shift?: boolean;
    callback: (e: KeyboardEvent) => void;
  }[];
}

export const useGlobalKeydown = ({ keys = [] }: UseGlobalKeydownProps) => {
  const metaKey =
    navigator.platform.indexOf('Mac') > -1 ? 'metaKey' : 'ctrlKey';

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (disableGlobalKeyDownElement(document.activeElement)) {
        return;
      }

      keys.forEach((key) => {
        if (
          key.keys.includes(event.key) &&
          !!event[metaKey] === !!key.meta &&
          !!event.shiftKey === !!key.shift
        ) {
          key.callback(event);
        }
      });
    },
    [keys, metaKey],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
};
