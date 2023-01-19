import clsx from 'clsx';
import {
  createContext,
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useContext,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import classes from './RightPanel.module.scss';

type RightPanelState = [
  HTMLDivElement | null,
  React.Dispatch<React.SetStateAction<HTMLDivElement | null>>
];

const RightPanelContext = createContext<RightPanelState | null>(null);

export const useRightPanelContext = (): RightPanelState => {
  const context = useContext(RightPanelContext);

  if (!context) {
    throw new Error('RightPanelContextProvider not found!');
  }

  return context;
};

export const RightPanelProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const rightPanelState = useState<HTMLDivElement | null>(null);

  return (
    <RightPanelContext.Provider value={rightPanelState}>
      {children}
    </RightPanelContext.Provider>
  );
};

export const RightPanelPortal = ({
  children,
}: {
  children: ReactNode;
}): React.ReactPortal | null => {
  const [rightPanel] = useRightPanelContext();

  if (!rightPanel) {
    return null;
  }

  return createPortal(children, rightPanel);
};

export const RightPanel = ({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>): ReactElement => {
  const [, setRightPanel] = useRightPanelContext();

  return (
    <div
      id="right-panel-root"
      ref={setRightPanel}
      className={clsx(classes.root, className)}
      {...props}
    >
      {children}
    </div>
  );
};
