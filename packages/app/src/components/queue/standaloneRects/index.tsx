import { OBJECT_TYPE, QueueObjectType } from '@legacy/model/object';
import { StandaloneCircle } from '@legacy/components/queue/standaloneRects/Circle';
import { StandaloneIcon } from '@legacy/components/queue/standaloneRects/Icon';
import { StandaloneImage } from '@legacy/components/queue/standaloneRects/Image';
import { StandaloneLine } from '@legacy/components/queue/standaloneRects/Line';
import { StandaloneSquare } from '@legacy/components/queue/standaloneRects/Square';
import { memo } from 'react';

export interface StandaloneRectProps {
  object: QueueObjectType;
}

export const StandaloneRect = memo(({ object }: StandaloneRectProps) => {
  switch (object.type) {
    case OBJECT_TYPE.RECT:
      return <StandaloneSquare objectId={object.id} {...object} />;
    case OBJECT_TYPE.CIRCLE:
      return <StandaloneCircle objectId={object.id} {...object} />;
    case OBJECT_TYPE.LINE:
      return <StandaloneLine objectId={object.id} {...object} />;
    case OBJECT_TYPE.ICON:
      return <StandaloneIcon {...object} />;
    case OBJECT_TYPE.IMAGE:
      return <StandaloneImage objectId={object.id} {...object} />;
    default:
      return <></>;
  }
});
