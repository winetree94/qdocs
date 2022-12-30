import styled from '@emotion/styled';
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import ReactDOM from 'react-dom';
import { GlobalOverlayContext } from './GlobalOverlay';

export interface OverlayContextType {
  requestClose: () => void;
}

export const OverlayContext = createContext<OverlayContextType>({
  requestClose: () => {
    throw new Error(
      'method not implemented, use must declare OverlayContextProvider on root'
    );
  },
});

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
  useBackdrop?: boolean;
  onRequestDestroy?: () => void;
  onDestroy?: () => void;
  onBackdropClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
}

export const Overlay: FunctionComponent<OverlayProps> = ({
  children,
  useBackdrop,
  onRequestDestroy,
  onDestroy,
  onBackdropClick,
}) => {
  const globalOverlayContext = useContext(GlobalOverlayContext);

  const destroyCallback = useRef(() => {
    if (onDestroy) {
      onDestroy();
    }
  });

  const requestClose = useCallback(() => {
    if (onRequestDestroy) {
      onRequestDestroy();
    }
  }, [onRequestDestroy]);

  const backdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      if (!onBackdropClick) {
        return;
      }
      onBackdropClick(event);
    },
    [onBackdropClick]
  );

  useEffect(() => () => destroyCallback.current(), []);

  return ReactDOM.createPortal(
    <OverlayContext.Provider
      value={{
        requestClose: requestClose,
      }}
    >
      {useBackdrop && (
        <OverlayBackdrop
          className="cdk-overlay-backdrop"
          onClick={backdropClick}
        ></OverlayBackdrop>
      )}
      <OverlayContent className="cdk-overlay-content">
        {children}
      </OverlayContent>
    </OverlayContext.Provider>,
    globalOverlayContext.rootElement
  );
};

Overlay.defaultProps = {
  useBackdrop: true,
};
