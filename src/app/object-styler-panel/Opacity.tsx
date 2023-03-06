import { Slider } from 'components';
import { QueueH6 } from 'components/head/Head';
import { QueueFade } from 'model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';
import styles from './Opacity.module.scss';

export const ObjectStyleOpacity = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const [firstObject] = selectedObjects;

  const fade = firstObject.fade;

  const updateFade = (fade: Partial<QueueFade>): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.map((object) => ({
          id: object.id,
          changes: {
            fade: {
              ...object.fade,
              ...fade,
            },
          },
        })),
      ),
    );
  };

  return (
    <div className={styles.ItemContainer}>
      <QueueH6>{t('global.tranparency')}</QueueH6>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>{t('global.tranparency')}</div>
        <div className={styles.SubInputContainer}>
          <Slider
            min={0}
            max={1}
            value={[fade.opacity]}
            step={0.05}
            onValueChange={([e]) =>
              updateFade({
                opacity: e,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
