import {
  ComponentType,
  createContext,
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { generateUUID } from '../functions/uuid';
import { Overlay, OverlayProps } from './Overlay';

const GLOBAL_OVERLAY_ROOT_ID = 'cdk-overlay-root';

export interface GlobalOverlayContextType {
  readonly rootElement: HTMLDivElement;
  open<P, C extends ComponentType<P>>(
    component: C,
    options: OverlayProps & { initProps: P }
  ): string;
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

export interface InternalGlobalNodes<P, C extends ComponentType<P>> {
  key: string;
  Component: C;
  options: OverlayProps & { initProps: P };
}

export const GlobalOverlayProvider: FunctionComponent<{
  children?: ReactNode;
}> = (props) => {
  const [overlayRoot, setOverlayRoot] = useState<HTMLDivElement>(
    (document.getElementById(GLOBAL_OVERLAY_ROOT_ID) as HTMLDivElement) || null
  );
  const [nodes, setNodes] = useState<InternalGlobalNodes<any, any>[]>([]);

  const createOverlayRootIfNotExists = useCallback(() => {
    if (!document.getElementById(GLOBAL_OVERLAY_ROOT_ID)) {
      const el = document.createElement('div');
      el.id = GLOBAL_OVERLAY_ROOT_ID;
      el.classList.add(GLOBAL_OVERLAY_ROOT_ID);
      document.body.appendChild(el);
      setOverlayRoot(el);
    }
  }, []);

  useEffect(
    () => createOverlayRootIfNotExists(),
    [createOverlayRootIfNotExists]
  );

  const close = useCallback(
    (key: string) => {
      const index = nodes.findIndex((n) => n.key === key);
      setNodes([...nodes.slice(0, index), ...nodes.slice(index + 1)]);
    },
    [nodes]
  );

  const open = useCallback(
    <P, T extends ComponentType<P>>(
      component: T,
      options: OverlayProps & { initProps: P }
    ): string => {
      const key = generateUUID();
      setNodes([
        ...nodes,
        {
          key: key,
          Component: component,
          options: options,
        },
      ]);
      return key;
    },
    [nodes]
  );

  return (
    <GlobalOverlayContext.Provider
      value={{
        rootElement: overlayRoot,
        open: open,
        close: close,
      }}
    >
      {props.children}
      {nodes.map(
        ({ key, Component, options: { initProps, ...overlayProps } }) => (
          <Overlay {...overlayProps} key={key}>
            <Component {...initProps}></Component>
          </Overlay>
        )
      )}
    </GlobalOverlayContext.Provider>
  );
};
