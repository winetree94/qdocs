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
  id: string;
  useBackdrop?: boolean;
  closeOnBackdrop?: boolean;
  onBackdropClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
}

export const Overlay: FunctionComponent<OverlayProps> = (props) => {
  const globalOverlayContext = useContext(GlobalOverlayContext);

  const onBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (props.closeOnBackdrop) {
        globalOverlayContext.close(props.id);
      }
      if (!props.onBackdropClick) {
        return;
      }
      props.onBackdropClick(event);
    },
    [props, globalOverlayContext]
  );

  return ReactDOM.createPortal(
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
};

Overlay.defaultProps = {
  useBackdrop: false,
  closeOnBackdrop: true,
};
