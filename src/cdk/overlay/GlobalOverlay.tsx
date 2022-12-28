/* eslint-disable react-hooks/exhaustive-deps */

import {
  createContext,
  FunctionComponent,
  ReactNode,
  ReactPortal,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { generateUUID } from '../functions/uuid';
import { Overlay, OverlayProps, OverlayRef } from './Overlay';

const GLOBAL_OVERLAY_ROOT_ID = 'cdk-overlay-root';

export interface GlobalOverlayContextType {
  readonly rootElement: HTMLDivElement;
  open(node: ReactNode, options?: OverlayProps): OverlayRef;
  close(key: string): void;
}

export const GlobalOverlayContext = createContext<GlobalOverlayContextType>({
  rootElement: document.getElementById(
    GLOBAL_OVERLAY_ROOT_ID
  ) as HTMLDivElement,
  open: () => {
    throw new Error(
      'method not implemented, use must declare GlobalOverlayProvider on root'
    );
  },
  close: () => {
    throw new Error(
      'method not implemented, use must declare GlobalOverlayProvider on root'
    );
  },
});

export const GlobalOverlayProvider: FunctionComponent<{
  children?: ReactNode;
}> = (props) => {
  const [overlayRoot, setOverlayRoot] = useState<HTMLDivElement>(
    (document.getElementById(GLOBAL_OVERLAY_ROOT_ID) as HTMLDivElement) || null
  );
  const [portals, setPortals] = useState<ReactPortal[]>([]);

  const createOverlayRootIfNotExists = useCallback(() => {
    if (!document.getElementById(GLOBAL_OVERLAY_ROOT_ID)) {
      const el = document.createElement('div');
      el.id = GLOBAL_OVERLAY_ROOT_ID;
      el.classList.add(GLOBAL_OVERLAY_ROOT_ID);
      document.body.appendChild(el);
      setOverlayRoot(el);
    }
  }, [overlayRoot]);

  useEffect(() => createOverlayRootIfNotExists(), []);

  const close = useCallback(
    (key: string) => {
      const index = portals.findIndex((n) => n.key === key);
      if (index !== -1) {
        setPortals([...portals.slice(0, index), ...portals.slice(index + 1)]);
      }
    },
    [portals]
  );

  const open = useCallback(
    (node: ReactNode, options?: OverlayProps): OverlayRef => {
      const key = options?.id || generateUUID();
      const ref: OverlayRef = {
        key: key,
        node: node,
        close: (): void => close(key),
      };
      const portal = createPortal(
        <Overlay {...options} id={key}>
          {node}
        </Overlay>,
        overlayRoot
      );
      portal.key = key;
      setPortals([...portals, portal]);
      return ref;
    },
    [overlayRoot, portals]
  );

  return (
    <>
      <GlobalOverlayContext.Provider
        value={{
          rootElement: overlayRoot,
          open: open,
          close: close,
        }}
      >
        {portals}
        {props.children}
      </GlobalOverlayContext.Provider>
    </>
  );
};
