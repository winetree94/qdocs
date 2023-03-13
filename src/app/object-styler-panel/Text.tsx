import { ChevronDownIcon } from '@radix-ui/react-icons';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { QueueH6 } from 'components/head/Head';
import { QueueInput } from 'components/input/Input';
import { QueueSelect } from 'components/select/Select';
import { QueueToggleGroup } from 'components/toggle-group/ToggleGroup';
import { QueueText } from 'model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import styles from './Text.module.scss';

export const ObjectStyleText = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const [firstObject] = selectedObjects;

  const text = firstObject.text;

  const updateText = (text: Partial<QueueText>): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.map((object) => ({
          id: object.id,
          changes: {
            text: {
              ...object.text,
              ...text,
            },
          },
        })),
      ),
    );
  };

  return (
    <div className={styles.ItemContainer}>
      <QueueH6>{t('global.text')}</QueueH6>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>{t('global.font-familly')}</div>
        <div className={styles.SubInputContainer}>
          <QueueSelect.Root value={text.fontFamily} onValueChange={(value): void => updateText({ fontFamily: value })}>
            <QueueSelect.Trigger className={styles.Select}>
              <QueueSelect.Value />
              <QueueSelect.Icon className="SelectIcon">
                <ChevronDownIcon />
              </QueueSelect.Icon>
            </QueueSelect.Trigger>
            <QueueSelect.Portal>
              <QueueSelect.Content>
                <QueueSelect.Viewport>
                  <QueueSelect.Group>
                    <QueueSelect.Item value="Arial">Arial</QueueSelect.Item>
                    <QueueSelect.Item value="Inter">Inter</QueueSelect.Item>
                    <QueueSelect.Item value="Roboto">Roboto</QueueSelect.Item>
                  </QueueSelect.Group>
                </QueueSelect.Viewport>
              </QueueSelect.Content>
            </QueueSelect.Portal>
          </QueueSelect.Root>
        </div>
      </div>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>{t('global.font-size')}</div>
        <div className={styles.SubInputContainer}>
          <QueueInput
            value={text.fontSize}
            type="number"
            onChange={(e): void => updateText({ fontSize: Number(e.target.value) })}
          />
        </div>
      </div>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>{t('global.horizontal-align')}</div>
        <div className={styles.SubInputContainer}>
          <QueueToggleGroup.Root
            type="single"
            value={text.horizontalAlign}
            onValueChange={(value: 'left' | 'center' | 'right'): void =>
              updateText({
                horizontalAlign: value || text.horizontalAlign,
              })
            }>
            <QueueToggleGroup.Item value="left" size={QUEUE_UI_SIZE.SMALL}>
              <SvgRemixIcon icon={'ri-align-left'} />
            </QueueToggleGroup.Item>
            <QueueToggleGroup.Item value="center" size={QUEUE_UI_SIZE.SMALL}>
              <SvgRemixIcon icon={'ri-align-center'} />
            </QueueToggleGroup.Item>
            <QueueToggleGroup.Item value="right" size={QUEUE_UI_SIZE.SMALL}>
              <SvgRemixIcon icon={'ri-align-right'} />
            </QueueToggleGroup.Item>
          </QueueToggleGroup.Root>
        </div>
      </div>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>{t('global.vertical-align')}</div>
        <div className={styles.SubInputContainer}>
          <QueueToggleGroup.Root
            type="single"
            value={text.verticalAlign}
            onValueChange={(value: 'top' | 'middle' | 'bottom'): void =>
              updateText({
                verticalAlign: value || text.verticalAlign,
              })
            }>
            <QueueToggleGroup.Item value="top" size={QUEUE_UI_SIZE.SMALL}>
              <SvgRemixIcon icon={'ri-align-top'} />
            </QueueToggleGroup.Item>
            <QueueToggleGroup.Item value="middle" size={QUEUE_UI_SIZE.SMALL}>
              <SvgRemixIcon icon={'ri-align-vertically'} />
            </QueueToggleGroup.Item>
            <QueueToggleGroup.Item value="bottom" size={QUEUE_UI_SIZE.SMALL}>
              <SvgRemixIcon icon={'ri-align-bottom'} />
            </QueueToggleGroup.Item>
          </QueueToggleGroup.Root>
        </div>
      </div>
      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>{t('global.color')}</div>
        <div className={styles.SubInputContainer}>
          <input
            id="text-color"
            className="input-color"
            type="color"
            value={text.fontColor}
            onChange={(e): void => updateText({ fontColor: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
