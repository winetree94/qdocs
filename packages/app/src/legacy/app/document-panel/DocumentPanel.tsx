import QueueCheckbox from '@legacy/components/buttons/checkbox/Checkbox';
import QueueColorPicker from '@legacy/components/color-picker/ColorPicker';
import { QueueInput } from '@legacy/components/input/Input';
import { QueueSelect } from '@legacy/components/select/Select';
import { QueueSeparator } from '@legacy/components/separator/Separator';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentActions, DocumentSelectors } from '@legacy/store/document';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { ScrollArea } from '@radix-ui/themes';

export const DocumentPanel = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { width, height, fill } = useAppSelector(
    DocumentSelectors.documentRect,
  );

  const handleChangeDocumentWidth = (
    event: ChangeEvent & { target: HTMLInputElement },
  ) => {
    dispatch(
      DocumentActions.updateDocumentRect({
        changes: {
          width: parseInt(event.target.value),
        },
      }),
    );
  };

  const handleChangeDocumentHeight = (
    event: ChangeEvent & { target: HTMLInputElement },
  ) => {
    dispatch(
      DocumentActions.updateDocumentRect({
        changes: {
          height: parseInt(event.target.value),
        },
      }),
    );
  };

  const handleChangeDocumentFill = (color: string) => {
    dispatch(
      DocumentActions.updateDocumentRect({
        changes: {
          fill: color,
        },
      }),
    );
  };

  return (
    <ScrollArea>
      <div className="tw-px-5 tw-py-4">
        <div className="tw-flex tw-flex-wrap tw-gap-2">
          <div className="tw-flex-1 tw-basis-full">
            <h2 className="tw-text-xs tw-font-medium tw-leading-snug">
              {t('global.frame')}
            </h2>
          </div>

          <div className="tw-flex-1 tw-shrink-0 tw-basis-full">
            <QueueSelect value={'16:9'} disabled>
              <QueueSelect.Group>
                <QueueSelect.Option value="16:9">16:9</QueueSelect.Option>
                <QueueSelect.Option value="16:10">16:10</QueueSelect.Option>
                <QueueSelect.Option value="4:3">4:3</QueueSelect.Option>
              </QueueSelect.Group>
            </QueueSelect>
          </div>
          <div className="tw-flex-1">
            <QueueInput
              value={width}
              type="number"
              variant="filled"
              disabled
              onChange={handleChangeDocumentWidth}
            />
          </div>
          <div className="tw-flex-1">
            <QueueInput
              value={height}
              type="number"
              variant="filled"
              disabled
              onChange={handleChangeDocumentHeight}
            />
          </div>
        </div>

        <QueueSeparator.Root className="tw-my-4" />

        <div className="tw-flex tw-flex-col tw-gap-2">
          <div className="tw-flex-1 tw-basis-full">
            <h2 className="tw-text-xs tw-font-medium tw-leading-snug">
              {t('global.background-color')}
            </h2>
          </div>

          <div className="tw-flex-1 tw-basis-full">
            <div className="tw-flex tw-gap-1 tw-justify-between tw-items-center tw-px-2 tw-py-1.5 tw-box-border tw-bg-[#E7E6EB] tw-leading-none tw-text-xs tw-font-normal tw-rounded-lg">
              <QueueColorPicker
                className="tw-flex-1 tw-w-full"
                color={fill}
                onChangeComplete={(color) =>
                  handleChangeDocumentFill(color.hex)
                }
              />
              <div className="tw-px-4 tw-font-normal tw-text-xs">
                {fill.replace('#', '').toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <QueueSeparator.Root className="tw-my-4" />

        <div className="tw-flex tw-flex-col tw-gap-2">
          <div className="tw-flex-1 tw-basis-full">
            <h2 className="tw-text-xs tw-font-medium tw-leading-snug">
              {t('global.layout-grid')}
            </h2>
          </div>

          <div className="tw-flex-1 tw-basis-full">
            <label className="tw-flex tw-items-center tw-bg-[var(--gray-2)] tw-rounded-lg tw-text-[var(--gray-8)] tw-cursor-not-allowed">
              <QueueCheckbox
                id="layoutGrid"
                name="layoutGrid"
                value="layoutGrid"
                readOnly
                disabled
              />
              <span className="tw-text-xs tw-font-normal tw-leading-none">
                {t('global.grid')}
              </span>
            </label>
          </div>
        </div>

        <QueueSeparator.Root className="tw-my-4" />

        <div className="tw-flex tw-flex-col tw-gap-2">
          <div className="tw-flex-1 tw-basis-full">
            <h2 className="tw-text-xs tw-font-medium tw-leading-snug">
              {t('global.display-items')}
            </h2>
          </div>

          <div className="tw-flex-1 tw-basis-full">
            <label className="tw-flex tw-items-center tw-bg-[var(--gray-2)] tw-rounded-lg tw-text-[var(--gray-8)] tw-cursor-not-allowed">
              <QueueCheckbox
                id="layoutGrid"
                name="layoutGrid"
                value="layoutGrid"
                readOnly
                disabled
              />
              <span className="tw-text-xs tw-font-normal tw-leading-none">
                {t('global.page-number')}
              </span>
            </label>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
