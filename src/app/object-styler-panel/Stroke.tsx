import { Slider } from 'components';
import { QueueH6 } from 'components/head/Head';
import { QueueStroke } from 'model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';
import styles from './Stroke.module.scss';
import { QueueSelect } from 'components/select/Select';

export const ObjectStyleStroke = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const [firstObject] = selectedObjects;

  const stroke = firstObject.stroke;

  const updateStroke = (stroke: Partial<QueueStroke>): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.map((object) => ({
          id: object.id,
          changes: {
            stroke: {
              ...object.stroke,
              ...stroke,
            },
          },
        })),
      ),
    );
  };

  return (
    <div className={styles.ItemContainer}>
      <QueueH6>{t('global.border')}</QueueH6>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>{t('global.thick')}</div>
        <div className={styles.SubInputContainer}>
          <Slider
            min={0}
            max={50}
            value={[stroke.width]}
            onValueChange={([e]) =>
              updateStroke({
                width: e,
              })
            }
          />
        </div>
      </div>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>{t('global.color')}</div>
        <div className={styles.SubInputContainer}>
          <input
            type="color"
            value={stroke.color}
            onChange={(e) =>
              updateStroke({
                color: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>{t('global.style')}</div>
        <div className={styles.SubInputContainer}>
          <QueueSelect value={stroke.dasharray} onValueChange={(value): void => updateStroke({ dasharray: value })}>
            <QueueSelect.Option value='solid'>-------</QueueSelect.Option>
            <QueueSelect.Option value='dashed'>- - - -</QueueSelect.Option>
            <QueueSelect.Option value='longDashed'>-- -- --</QueueSelect.Option>
          </QueueSelect>
        </div>
      </div>
    </div>
  );
};
