import { Slider } from 'components';
import { QueueH6 } from 'components/head/Head';
import { QueueScale } from 'model/property';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';
import styles from './Scale.module.scss';

export const ObjectStyleScale = () => {
  const dispatch = useAppDispatch();
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const [firstObject] = selectedObjects;

  const scale = firstObject.scale;

  const updateStroke = (scale: Partial<QueueScale>): void => {
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.map((object) => ({
          id: object.id,
          changes: {
            scale: {
              ...object.scale,
              ...scale,
            },
          },
        })),
      ),
    );
  };

  return (
    <div className={styles.ItemContainer}>
      <QueueH6>확대</QueueH6>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>배율</div>
        <div className={styles.SubInputContainer}>
          <Slider
            min={0}
            max={5}
            value={[scale.scale]}
            step={0.05}
            onValueChange={([e]) =>
              updateStroke({
                scale: e,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
