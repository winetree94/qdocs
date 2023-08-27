import { ReactElement } from 'react';
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

export const ObjectStylerPanel = (): ReactElement | null => {
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);

  if (selectedObjects.length === 0) {
    return <div className="tw-h-full" />;
  }

  return (
    <div className="tw-px-5 tw-py-4">
      <div className="tw-flex tw-flex-col tw-gap-3">
        <ObjectStyleRect />
        <QueueSeparator.Root />
        <ObjectStyleText />
        <QueueSeparator.Root />
        <ObjectStyleBackground />
        <QueueSeparator.Root />
        <ObjectStyleScale />
        <QueueSeparator.Root />
        <ObjectStyleRotate />
        <QueueSeparator.Root />
        {selectedObjects[0].type !== 'icon' && (
          <>
            <ObjectStyleStroke />
            <QueueSeparator.Root />
          </>
        )}
        <ObjectStyleOpacity />
        <QueueSeparator.Root />
      </div>
    </div>
  );
};
