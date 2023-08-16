import { QueueObjectType } from 'model/object';
import { StandaloneCircle } from 'components/queue/standaloneRects/Circle';
import { StandaloneIcon } from 'components/queue/standaloneRects/Icon';
import { StandaloneImage } from 'components/queue/standaloneRects/Image';
import { StandaloneLine } from 'components/queue/standaloneRects/Line';
import { StandaloneSquare } from 'components/queue/standaloneRects/Square';
import {
  isNormalizedQueueIconObjectType,
  isNormalizedQueueImageObjectType,
} from 'store/object';

export interface StandaloneRectProps {
  object: QueueObjectType;
}

export const StandaloneRect = ({ object }: StandaloneRectProps) => {
  switch (object.type) {
    case 'rect':
      return <StandaloneSquare objectId={object.id} {...object} />;
    case 'circle':
      return <StandaloneCircle objectId={object.id} {...object} />;
    case 'line':
      return <StandaloneLine objectId={object.id} {...object} />;
    case 'icon': {
      const isIconObject = isNormalizedQueueIconObjectType(object);

      if (!isIconObject) {
        return null;
      }

      return <StandaloneIcon iconType={object.iconType} {...object} />;
    }

    case 'image': {
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
