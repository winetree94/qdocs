import { memo, ReactElement } from 'react';
import { useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { ObjectStyleText } from './Text';
import { ObjectStyleOpacity } from './Opacity';
import { ObjectStyleStroke } from './Stroke';
import { QueueSeparator } from 'components/separator/Separator';
import { ObjectStyleBackground } from './Background';
import { ObjectStyleRect } from './Rect';
import { ObjectStyleScale } from './Scale';
import { ObjectStyleRotate } from './Rotate';
import {
  supportFade,
  supportFill,
  supportRect,
  supportRotation,
  supportScale,
  supportStroke,
  supportText,
} from 'model/support';

export const ObjectStylerPanel = memo((): ReactElement | null => {
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const firstObject = selectedObjects[0];

  if (selectedObjects.length <= 0) {
    return null;
  }

  return (
    <div className="tw-px-5 tw-py-4">
      <div className="tw-flex tw-flex-col tw-gap-3">
        {supportRect(firstObject) && (
          <ObjectStyleRect
            x={firstObject.rect.x}
            y={firstObject.rect.y}
            width={firstObject.rect.width}
            height={firstObject.rect.height}
          />
        )}
        {supportText(firstObject) && (
          <>
            <QueueSeparator.Root className="tw-my-2" />
            <ObjectStyleText />
          </>
        )}
        {supportFill(firstObject) && (
          <>
            <QueueSeparator.Root className="tw-my-2" />
            <ObjectStyleBackground />
          </>
        )}
        {supportScale(firstObject) && (
          <>
            <QueueSeparator.Root className="tw-my-2" />
            <ObjectStyleScale />
          </>
        )}
        {supportRotation(firstObject) && (
          <>
            <QueueSeparator.Root className="tw-my-2" />
            <ObjectStyleRotate />
          </>
        )}
        {supportStroke(firstObject) && (
          <>
            <QueueSeparator.Root className="tw-my-2" />
            <ObjectStyleStroke />
          </>
        )}
        {supportFade(firstObject) && (
          <>
            <QueueSeparator.Root className="tw-my-2" />
            <ObjectStyleOpacity />
          </>
        )}
        <QueueSeparator.Root className="tw-my-2" />
      </div>
    </div>
  );
});
