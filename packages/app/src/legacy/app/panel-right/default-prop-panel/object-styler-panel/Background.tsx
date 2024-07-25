import { EntityId } from '@reduxjs/toolkit';
import { QueueFill } from '@legacy/model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from '@legacy/store/history';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { ObjectActions } from '@legacy/store/object';
import { SettingSelectors } from '@legacy/store/settings';
import { QueueObjectType } from '@legacy/model/object';
import QueueColorPicker from '@legacy/components/color-picker/ColorPicker';
import { store } from '@legacy/store';
import { supportFill } from '../../../../model/support/property';
import { Separator, TextField } from '@radix-ui/themes';

export const ObjectStyleBackground = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { color, opacity } = useAppSelector(
    SettingSelectors.firstSelectedObjectFill,
    (prev, next) => prev.color === next.color && prev.opacity === next.opacity,
  );

  const updateObjectFill = (fill: Partial<QueueFill>) => {
    const selectedObjects = SettingSelectors.selectedObjects(store.getState());
    dispatch(HistoryActions.Capture());
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.filter(supportFill).map<{
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
    <div className="tw-flex tw-flex-wrap tw-gap-2">
      <div className="tw-flex-1 tw-basis-full">
        <h2 className="tw-text-xs tw-font-medium tw-leading-snug">
          {t('global.fill-color')}
        </h2>
      </div>

      <div className="tw-flex-1 tw-basis-full">
        <div className="tw-flex tw-gap-2 tw-items-center tw-px-2 tw-py-1.5 tw-box-border tw-bg-[#E7E6EB] tw-leading-none tw-text-xs tw-font-normal tw-rounded-lg tw-h-[34px]">
          <div className="tw-flex tw-items-center tw-gap-2">
            <QueueColorPicker
              color={color}
              onChange={(color) => {
                updateObjectFill({ color: color.hex });
              }}
            />
            <div className="tw-flex-1">{color.replace('#', '')}</div>
          </div>
          <Separator size="4" className='tw-my-4' />
          <div className="tw-flex tw-items-center tw-basis-3/5">
            <TextField.Root
              size="1"
              type="number"
              value={opacity * 100}
              onChange={(event): void => updateObjectFill({
                opacity: Number(event.target.value) / 100,
              })} />
          </div>
        </div>
      </div>
    </div>
  );
};
