import { StandaloneCircle } from 'components/queue/standaloneRects/Circle';
import {
  StandaloneSquareProps,
  StandaloneSquare,
} from 'components/queue/standaloneRects/Square';
import { OBJECT_META, OBJECT_TYPES } from 'model/object';

export const StandaloneRect = ({
  type,
  ...props
}: StandaloneSquareProps & { type: OBJECT_TYPES }) => {
  switch (type) {
    case OBJECT_META.RECT:
      return <StandaloneSquare {...props} />;
    case OBJECT_META.CIRCLE:
      return <StandaloneCircle {...props} />;
    case OBJECT_META.LINE:
    case OBJECT_META.ICON:
    case OBJECT_META.IMAGE:
    default:
      return <></>;
  }
};
