import { EntityId } from '@reduxjs/toolkit';
import { Slider } from 'components';
import { QueueH6 } from 'components/head/Head';
import { QueueFill } from 'model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';
import styles from './Background.module.scss';
import { QueueObjectType } from 'model/object';
import { supportFillAll } from 'model/support';

export const ObjectStyleBackground = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);

  if (!supportFillAll(selectedObjects)) {
    return <></>;
  }

  const [firstObject] = selectedObjects;
  const fill = firstObject.fill;

  const updateObjectFill = (fill: Partial<QueueFill>) => {
    dispatch(HistoryActions.Capture());
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.map<{
          id: EntityId;
          changes: Partial<QueueObjectType>;
        }>((object) => {
          return {
            id: object.id,
            changes: {
              fill: {
                ...object.fill,
                ...fill,
              },
            },
          };
        }),
      ),
    );
  };

  return (
    <div className={styles.ItemContainer}>
      <QueueH6>{t('global.background')}</QueueH6>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>{t('global.color')}</div>
        <div className={styles.SubInputContainer}>
          <input
            type="color"
            value={fill.color}
            onChange={(e) =>
              updateObjectFill({
                color: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>{t('global.opacity')}</div>
        <div className={styles.SubInputContainer}>
          <Slider
            min={0}
            max={1}
            value={[fill.opacity]}
            step={0.05}
            onValueChange={([e]) =>
              updateObjectFill({
                opacity: e,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
