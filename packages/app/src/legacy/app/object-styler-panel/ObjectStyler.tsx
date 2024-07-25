import { memo, ReactElement } from 'react';
import { useAppSelector } from '@legacy/store/hooks';
import { SettingSelectors } from '@legacy/store/settings/selectors';
import { ObjectStyleText } from './Text';
import { ObjectStyleOpacity } from './Opacity';
import { ObjectStyleStroke } from './Stroke';
import { ObjectStyleBackground } from './Background';
import { ObjectStyleRect } from './Rect';
import { ObjectStyleScale } from './Scale';
import { ObjectStyleRotate } from './Rotate';
import { SUPPPORTED_PROPERTY_MAP } from '../../model/support/property';
import { Separator } from '@radix-ui/themes';

export const ObjectStylerPanel = memo(function ObjectStylerPanel(): ReactElement | null {
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
            <Separator my="3" size="4" />
            <ObjectStyleText />
          </>
        )}
        {SUPPPORTED_PROPERTY_MAP.fill[firstSelectedObjectType] && (
          <>
            <Separator my="3" size="4" />
            <ObjectStyleBackground />
          </>
        )}
        {SUPPPORTED_PROPERTY_MAP.scale[firstSelectedObjectType] && (
          <>
            <Separator my="3" size="4" />
            <ObjectStyleScale />
          </>
        )}
        {SUPPPORTED_PROPERTY_MAP.rotate[firstSelectedObjectType] && (
          <>
            <Separator my="3" size="4" />
            <ObjectStyleRotate />
          </>
        )}
        {SUPPPORTED_PROPERTY_MAP.stroke[firstSelectedObjectType] && (
          <>
            <Separator my="3" size="4" />
            <ObjectStyleStroke />
          </>
        )}
        {SUPPPORTED_PROPERTY_MAP.fade[firstSelectedObjectType] && (
          <>
            <Separator my="3" size="4" />
            <ObjectStyleOpacity />
          </>
        )}
        <Separator my="3" size="4" />
      </div>
    </div>
  );
});
