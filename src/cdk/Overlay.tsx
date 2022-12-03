import { FunctionComponent, ReactNode } from 'react';
import ReactDOM from 'react-dom';

const overlayRoot = document.createElement('div');
overlayRoot.id = 'cdk-overlay-root';
overlayRoot.classList.add('cdk-overlay-root');
document.body.appendChild(overlayRoot);

export const Overlay: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return ReactDOM.createPortal(children, overlayRoot);
};
