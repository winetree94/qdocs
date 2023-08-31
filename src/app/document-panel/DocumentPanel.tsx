import QueueCheckbox from 'components/buttons/checkbox/Checkbox';
import QueueColorPicker from 'components/color-picker/ColorPicker';
import { QueueInput } from 'components/input/Input';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { QueueSelect } from 'components/select/Select';
import { QueueSeparator } from 'components/separator/Separator';
import { useTranslation } from 'react-i18next';
import { DocumentSelectors } from 'store/document';
import { useAppSelector } from 'store/hooks';

export const DocumentPanel = () => {
  const { t } = useTranslation();
  const { documentRect } = useAppSelector(DocumentSelectors.document);

  return (
    <QueueScrollArea.Root className="tw-h-full">
      <QueueScrollArea.Viewport>
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
                value={documentRect.width}
                type="number"
                variant="filled"
                readOnly
              />
            </div>
            <div className="tw-flex-1">
              <QueueInput
                value={documentRect.height}
                type="number"
                variant="filled"
                readOnly
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
                  color={'#ffffff'}
                />
                <div className="tw-px-4 tw-font-normal tw-text-xs">FFFFFF</div>
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
              <label className="tw-flex tw-items-center tw-bg-[#E7E6EB] tw-rounded-lg">
                <QueueCheckbox
                  id="layoutGrid"
                  name="layoutGrid"
                  value="layoutGrid"
                  readOnly
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
              <label className="tw-flex tw-items-center tw-bg-[#E7E6EB] tw-rounded-lg">
                <QueueCheckbox
                  id="layoutGrid"
                  name="layoutGrid"
                  value="layoutGrid"
                  readOnly
                />
                <span className="tw-text-xs tw-font-normal tw-leading-none">
                  {t('global.page-number')}
                </span>
              </label>
            </div>
          </div>
        </div>
      </QueueScrollArea.Viewport>
      <QueueScrollArea.Scrollbar orientation="vertical">
        <QueueScrollArea.Thumb />
      </QueueScrollArea.Scrollbar>
    </QueueScrollArea.Root>
  );
};
