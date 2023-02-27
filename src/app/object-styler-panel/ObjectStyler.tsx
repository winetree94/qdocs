import { ReactElement } from 'react';
import { useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { ObjectStylerBackground } from 'components/object-styler/ObjectStylerBackground';
import styles from './ObjectStyler.module.scss';
import { ObjectStyleText } from './Text';
import { ObjectStyleOpacity } from './Opacity';
import { ObjectStyleStroke } from './Stroke';

export const ObjectStylerPanel = (): ReactElement | null => {
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  return (
    <div className={styles.StylerRoot}>
      <ObjectStylerBackground />
      <div className="flex flex-col gap-3">
        <hr className="my-2" />
        {selectedObjects[0].type !== 'icon' && (
          <>
            <ObjectStyleStroke />
            <hr className="my-2" />
          </>
        )}
        <ObjectStyleOpacity />
        <ObjectStyleText />
      </div>
    </div>
  );
};
