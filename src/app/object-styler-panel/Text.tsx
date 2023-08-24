import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { QueueInput } from 'components/input/Input';
import { QueueToggleGroup } from 'components/toggle-group/ToggleGroup';
import { QueueText } from 'model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { QueueSelect } from 'components/select/Select';
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
    <div className="tw-flex tw-flex-wrap tw-gap-2">
      <div className="tw-flex-1 tw-basis-full">
        <h2 className="tw-text-xs tw-font-medium tw-leading-snug">Text</h2>
      </div>
      <div className="tw-flex-1 tw-shrink-0 tw-basis-full">
        <QueueSelect
          value={text.fontFamily}
          onValueChange={(value): void => updateText({ fontFamily: value })}>
          <QueueSelect.Group>
            <QueueSelect.Option value="Arial">Arial</QueueSelect.Option>
            <QueueSelect.Option value="Inter">Inter</QueueSelect.Option>
            <QueueSelect.Option value="Roboto">Roboto</QueueSelect.Option>
          </QueueSelect.Group>
        </QueueSelect>
      </div>
      <div className="tw-flex-1">
        <QueueSelect value="Bold" disabled>
          <QueueSelect.Option value="Bold">Bold</QueueSelect.Option>
        </QueueSelect>
      </div>
      <div className="tw-flex-1">
        <QueueInput
          value={text.fontSize}
          type="number"
          variant="filled"
          onChange={(e): void =>
            updateText({ fontSize: Number(e.target.value) })
          }
        />
      </div>

      <div className={styles.SubItemContainer}>
        <div className={styles.SubTitle}>{t('global.horizontal-align')}</div>
        <div>
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
        <div>
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
        <div>
          <input
            id="text-color"
            className="tw-input-color"
            type="color"
            value={text.fontColor}
            onChange={(e): void => updateText({ fontColor: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
