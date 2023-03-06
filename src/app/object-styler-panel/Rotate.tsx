import { Slider } from 'components';
import { QueueH6 } from 'components/head/Head';
import { QueueRotate } from 'model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';
import styles from './Rotate.module.scss';

export const ObjectStyleRotate = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const [firstObject] = selectedObjects;

  const rotate = firstObject.rotate;

  const updateStroke = (rotate: Partial<QueueRotate>): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.map((object) => ({
          id: object.id,
          changes: {
            rotate: {
              ...object.rotate,
              ...rotate,
            },
          },
        })),
      ),
    );
  };

  return (
    <div className={styles.ItemContainer}>
      <QueueH6>{t('global.rotation')}</QueueH6>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>{t('global.degree')}</div>
        <div className={styles.SubInputContainer}>
          <Slider
            min={0}
            max={360}
            value={[rotate.degree]}
            step={0.05}
            onValueChange={([e]) =>
              updateStroke({
                degree: e,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
