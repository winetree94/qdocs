import { EntityId } from '@reduxjs/toolkit';
import { Slider } from 'components';
import { QueueH6 } from 'components/head/Head';
import { QueueFill } from 'model/property';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { NormalizedQueueObjectType, ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';
import styles from './Background.module.scss';

export const ObjectStyleBackground = () => {
  const dispatch = useAppDispatch();

  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const [firstObject] = selectedObjects;
  const fill = firstObject.fill;

  const updateObjectFill = (fill: Partial<QueueFill>) => {
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.map<{ id: EntityId; changes: Partial<NormalizedQueueObjectType> }>((object) => {
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
      <QueueH6>배경</QueueH6>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>색상</div>
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
        <div className={styles.SubTitle}>투명도</div>
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
