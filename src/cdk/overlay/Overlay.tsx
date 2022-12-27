import styled from '@emotion/styled';
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
} from 'react';
import ReactDOM from 'react-dom';
import { GlobalOverlayContext } from './GlobalOverlay';

export interface OverlayContextType {
  key: string;
  close: () => void;
}

export const OverlayContext = createContext<OverlayContextType>({
  key: '',
  close: () => {
    throw new Error(
      'method not implemented, use must declare OverlayContextProvider on root'
    );
  },
});

export interface OverlayRef {
  key: string;
  node: ReactNode;
  close: () => void;
}

const OverlayBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: auto;
`;

const OverlayContent = styled.div`
  position: absolute;
  pointer-events: auto;
`;

export interface OverlayProps {
  children?: ReactNode;
  type?: 'global' | 'connected';
  id: string;
  useBackdrop?: boolean;
  closeOnBackdrop?: boolean;
  onBackdropClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
}

export const InternalOverlay: FunctionComponent<OverlayProps> = (props) => {
  const globalOverlayContext = useContext(GlobalOverlayContext);
  const onBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!props.onBackdropClick) {
        return;
      }
      props.onBackdropClick(event);
    },
    [props]
  );

  const portal = ReactDOM.createPortal(
    <OverlayContext.Provider
      value={{
        key: props.id,
        close: () => globalOverlayContext.close(props.id),
      }}
    >
      {props.useBackdrop && (
        <OverlayBackdrop
          className="cdk-overlay-backdrop"
          onClick={onBackdropClick}
        ></OverlayBackdrop>
      )}
      <OverlayContent className="cdk-overlay-content">
        {props.children}
      </OverlayContent>
    </OverlayContext.Provider>,
    globalOverlayContext.rootElement
  );

  return portal;
};

InternalOverlay.defaultProps = {
  useBackdrop: false,
  closeOnBackdrop: true,
};
