import styled from '@emotion/styled';
import { FunctionComponent, ReactNode, useLayoutEffect, useState } from 'react';

export interface ConnectedOverlayPosition {
  originX: 'start' | 'center' | 'end';
  originY: 'top' | 'center' | 'bottom';
  overlayX: 'start' | 'center' | 'end';
  overlayY: 'top' | 'center' | 'bottom';
  offsetX?: number;
  offsetY?: number;
}

export interface ConnectedOverlayContentProps {
  target?: HTMLElement | null;
  positions?: ConnectedOverlayPosition[];
  children?: ReactNode;
}

const ConnectedOverlayContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
`;

export const ConnectedOverlayContent: FunctionComponent<
  ConnectedOverlayContentProps
> = ({ target, positions, children }) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useLayoutEffect(() => {
    if (target) {
      const rect = target.getBoundingClientRect();
      setPosition({
        x: rect.x,
        y: rect.y + rect.height,
      });
      console.log(rect);
    }
  }, [target, positions]);

  return (
    <ConnectedOverlayContainer
      className="cdk-connected-overlay-pane"
      style={{ top: position.y, left: position.x }}
    >
      {children}
    </ConnectedOverlayContainer>
  );
};
