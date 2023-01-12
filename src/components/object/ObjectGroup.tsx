import { css } from '@emotion/css';
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
      <div
        className={css`
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        `}
      >
        {children}
      </div>
    </ObjectGroupContext.Provider>
  );
};
