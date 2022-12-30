import styled from '@emotion/styled';
import { FunctionComponent } from 'react';
import { ConnectedOverlayContent } from '../../cdk/overlay/contents/ConnectedOverlayContent';
import { Overlay, OverlayProps } from '../../cdk/overlay/Overlay';

export interface PopoverProps extends OverlayProps {
  visible: boolean;
  target?: HTMLElement | null;
}

const PopoverContainer = styled.div`
  background-color: white;
  box-shadow: 0 2px 6px 2px rgb(60 64 67 / 15%);
  border-radius: 3px;
`;

export const Popover: FunctionComponent<PopoverProps> = ({
  visible,
  target,
  children,
  ...overlayProps
}) => {
  if (!visible) {
    return null;
  }
  return (
    <Overlay {...overlayProps}>
      <ConnectedOverlayContent target={target}>
        <PopoverContainer>{children}</PopoverContainer>
      </ConnectedOverlayContent>
    </Overlay>
  );
};
