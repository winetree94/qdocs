import { OBJECT_META } from 'model/object';
import { StandaloneCircle } from 'components/queue/standaloneRects/Circle';
import { StandaloneIcon } from 'components/queue/standaloneRects/Icon';
import { StandaloneImage } from 'components/queue/standaloneRects/Image';
import { StandaloneLine } from 'components/queue/standaloneRects/Line';
import { StandaloneSquare } from 'components/queue/standaloneRects/Square';
import {
  isNormalizedQueueIconObjectType,
  isNormalizedQueueImageObjectType,
  NormalizedQueueImageObjectType,
  NormalizedQueueObjectType,
} from 'store/object';

export interface StandaloneRectProps {
  object: NormalizedQueueObjectType | NormalizedQueueImageObjectType;
}

export const StandaloneRect = ({ object }: StandaloneRectProps) => {
  switch (object.type) {
    case OBJECT_META.RECT:
      return <StandaloneSquare objectId={object.id} {...object} />;
    case OBJECT_META.CIRCLE:
      return <StandaloneCircle objectId={object.id} {...object} />;
    case OBJECT_META.LINE:
      return <StandaloneLine objectId={object.id} {...object} />;
    case OBJECT_META.ICON: {
      const isIconObject = isNormalizedQueueIconObjectType(object);

      if (!isIconObject) {
        return null;
      }

      return <StandaloneIcon iconType={object.iconType} {...object} />;
    }

    case OBJECT_META.IMAGE: {
      const isImageObject = isNormalizedQueueImageObjectType(object);

      if (!isImageObject) {
        return null;
      }

      return <StandaloneImage objectId={object.id} {...object} />;
    }
    default:
      return <></>;
  }
};
