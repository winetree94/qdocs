import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Slider } from 'components';
import { QueueH6 } from 'components/head/Head';
import { QueueSelect } from 'components/select/Select';
import { QueueStroke } from 'model/property';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';
import styles from './Stroke.module.scss';

export const ObjectStyleStroke = () => {
  const dispatch = useAppDispatch();
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const [firstObject] = selectedObjects;

  const stroke = firstObject.stroke;

  const updateStroke = (stroke: Partial<QueueStroke>): void => {
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
      <QueueH6>테두리</QueueH6>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>굵기</div>
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
        <div className={styles.SubTitle}>색상</div>
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
        <div className={styles.SubTitle}>스타일</div>
        <div className={styles.SubInputContainer}>
          <QueueSelect.Root
            value={stroke.dasharray}
            onValueChange={(value): void => updateStroke({ dasharray: value })}>
            <QueueSelect.Trigger className={styles.Select}>
              <QueueSelect.Value placeholder="글꼴" />
              <QueueSelect.Icon className="SelectIcon">
                <ChevronDownIcon />
              </QueueSelect.Icon>
            </QueueSelect.Trigger>
            <QueueSelect.Portal>
              <QueueSelect.Content>
                <QueueSelect.Viewport>
                  <QueueSelect.Group>
                    <QueueSelect.Item value="solid">-------</QueueSelect.Item>
                    <QueueSelect.Item value="Inter">- - - - -</QueueSelect.Item>
                    <QueueSelect.Item value="Roboto">-- -- --</QueueSelect.Item>
                  </QueueSelect.Group>
                </QueueSelect.Viewport>
              </QueueSelect.Content>
            </QueueSelect.Portal>
          </QueueSelect.Root>
        </div>
      </div>
    </div>
  );
};
