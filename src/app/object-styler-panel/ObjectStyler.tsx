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
import { SUPPPORTED_PROPERTY_MAP } from '../../model/support/property';

export const ObjectStylerPanel = memo((): ReactElement | null => {
  const firstSelectedObjectType = useAppSelector(
    SettingSelectors.firstSelectedObjectType,
  );

  if (!firstSelectedObjectType) {
    return null;
  }

  return (
    <div className="tw-px-5 tw-py-4">
      <div className="tw-flex tw-flex-col tw-gap-3">
        {SUPPPORTED_PROPERTY_MAP.rect[firstSelectedObjectType] && (
          <ObjectStyleRect />
        )}
        {SUPPPORTED_PROPERTY_MAP.text[firstSelectedObjectType] && (
          <>
            <QueueSeparator.Root className="tw-my-2" />
            <ObjectStyleText />
          </>
        )}
        {SUPPPORTED_PROPERTY_MAP.fill[firstSelectedObjectType] && (
          <>
            <QueueSeparator.Root className="tw-my-2" />
            <ObjectStyleBackground />
          </>
        )}
        {SUPPPORTED_PROPERTY_MAP.scale[firstSelectedObjectType] && (
          <>
            <QueueSeparator.Root className="tw-my-2" />
            <ObjectStyleScale />
          </>
        )}
        {SUPPPORTED_PROPERTY_MAP.rotate[firstSelectedObjectType] && (
          <>
            <QueueSeparator.Root className="tw-my-2" />
            <ObjectStyleRotate />
          </>
        )}
        {SUPPPORTED_PROPERTY_MAP.stroke[firstSelectedObjectType] && (
          <>
            <QueueSeparator.Root className="tw-my-2" />
            <ObjectStyleStroke />
          </>
        )}
        {SUPPPORTED_PROPERTY_MAP.fade[firstSelectedObjectType] && (
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
