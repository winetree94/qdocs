import { StandaloneSquareProps, StandaloneSquare } from 'components/queue/standaloneRects/Square';

export const StandaloneRect = ({ type, ...props }: StandaloneSquareProps & { type: string }) => {
  switch (type) {
    case 'rect':
      return <StandaloneSquare {...props} />;
    case 'circle':
    case 'line':
    case 'icon':
    case 'image':
    default:
      return <></>;
  }
};
