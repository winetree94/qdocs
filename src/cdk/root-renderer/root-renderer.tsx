import { nanoid } from '@reduxjs/toolkit';
import { createContext, Fragment, useContext, useState } from 'react';

export interface RootRendererContextType {
  /**
   * @description
   * 현재 루트에 렌더링된 컴포넌트와 id 목록
   */
  rendered: {
    id: string;
    element: JSX.Element;
  }[];

  /**
   * @description
   * 루트에 컴포넌트를 렌더링하고, 렌더링된 컴포넌트의 id 를 반환합니다.
   */
  render: (element: JSX.Element) => string;

  /**
   * @description
   * 루트에 렌더링된 컴포넌트를 제거합니다.
   */
  clear: (key: string) => void;
}

const RootRendererContext = createContext<RootRendererContextType>({
  rendered: [],
  render: (element: JSX.Element) => '',
  clear: (key: string) => void 0,
});

export const RootRendererProvider = ({ children }: { children: React.ReactNode }) => {
  const [rendered, setRendered] = useState<RootRendererContextType['rendered']>([]);

  const render = (element: JSX.Element) => {
    const model = {
      id: nanoid(),
      element: element,
    };
    setRendered([...rendered, model]);
    return model.id;
  };

  const clear = (key: string) => {
    setRendered(
      rendered.filter((model) => {
        return model.id !== key;
      }),
    );
  };

  return (
    <RootRendererContext.Provider
      value={{
        rendered: rendered,
        render: render,
        clear: clear,
      }}>
      {children}
      {rendered.map((model) => (
        <Fragment key={model.id}>{model.element}</Fragment>
      ))}
    </RootRendererContext.Provider>
  );
};

export const useRootRenderer = () => {
  return useContext(RootRendererContext);
};
