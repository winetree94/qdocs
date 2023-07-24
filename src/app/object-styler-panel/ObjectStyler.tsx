import { ReactElement } from 'react';
import { useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { ObjectStyleText } from './Text';
import { ObjectStyleOpacity } from './Opacity';
import { ObjectStyleStroke } from './Stroke';
import { QueueSeparator } from 'components/separator/Separator';
import { ObjectStyleBackground } from './Background';
import styles from './ObjectStyler.module.scss';
import { ObjectStyleRect } from './Rect';
import { ObjectStyleScale } from './Scale';
import { ObjectStyleRotate } from './Rotate';

export const ObjectStylerPanel = (): ReactElement | null => {
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  return (
    <div className={styles.StylerRoot}>
      <div className="tw-flex tw-flex-col tw-gap-3">
        <ObjectStyleRect />
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
        <ObjectStyleText />
      </div>
    </div>
  );
};
