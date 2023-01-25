import { createContext, FunctionComponent, ReactNode, useState } from 'react';

export interface ObjectGroupContextType {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export const ObjectGroupContext = createContext<ObjectGroupContextType>({
  opened: true,
  setOpened: (opened: boolean) => null,
});
ObjectGroupContext.displayName = 'ObjectGroupContext';

export const ObjectGroup: FunctionComponent<{ children: ReactNode }> = (
  props
) => {
  const [opened, setOpened] = useState<boolean>(true);

  const { children } = props;
  return (
    <ObjectGroupContext.Provider
      value={{
        opened: opened,
        setOpened: setOpened,
      }}
    >
      <div>
        {children}
      </div>
    </ObjectGroupContext.Provider>
  );
};
