import styled from '@emotion/styled';
import { FunctionComponent } from 'react';
import { Overlay, OverlayProps } from '../overlay/Overlay';

export interface PopoverProps extends OverlayProps {
  visible: boolean;
  target?: HTMLElement | null;
}

const PopoverContainer = styled.div`
  background-color: white;
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
      <PopoverContainer>{children}</PopoverContainer>
    </Overlay>
  );
};
