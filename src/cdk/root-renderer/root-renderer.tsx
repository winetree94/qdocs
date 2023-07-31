import { createContext, Fragment, useContext, useState } from 'react';

const RootRendererContext = createContext({
  render: (element: JSX.Element) => element,
});

export const RootRendererProvider = ({ children }: { children: React.ReactNode }) => {
  const [rendered, setRendered] = useState<JSX.Element[]>([]);

  const render = (element: JSX.Element) => {
    setRendered((rendered) => [...rendered, element]);
    return element;
  };

  return (
    <RootRendererContext.Provider
      value={{ render: render }}>
      {children}
      {rendered.map((element, index) => (
        <Fragment key={index}>{element}</Fragment>
      ))}
    </RootRendererContext.Provider>
  );
};

export const useRootRenderer = () => {
  return useContext(RootRendererContext);
};
