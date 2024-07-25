import QueueColorPicker from '@legacy/components/color-picker/ColorPicker';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentActions, DocumentSelectors } from '@legacy/store/document';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { Checkbox, Flex, ScrollArea, Select, Separator, Text, TextField } from '@radix-ui/themes';

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

          <Text size={"1"}>
            {t('global.frame')}
          </Text>

          <div className="tw-flex-1 tw-shrink-0 tw-basis-full">
            <Select.Root defaultValue="16:9" size={"1"} disabled>
              <Select.Trigger className='tw-w-full' />
              <Select.Content>
                <Select.Item value="16:9">16:9</Select.Item>
                <Select.Item value="16:10">16:10</Select.Item>
                <Select.Item value="4:3">4:3</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          <div className="tw-flex-1">
            <TextField.Root size="1" value={width} disabled onChange={handleChangeDocumentWidth}>
            </TextField.Root>
          </div>
          <div className="tw-flex-1">
            <TextField.Root size="1" value={height} disabled onChange={handleChangeDocumentHeight}>
            </TextField.Root>
          </div>
        </div>

        <Separator my="3" size="4" />

        <div className="tw-flex tw-flex-col tw-gap-2">
          <Text size="1">{t('global.background-color')}</Text>

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

        <Separator my="3" size="4" />

        <Text size="1">{t('global.layout-grid')}</Text>

        <Text as="label" size="1" color="gray">
          <Flex gap="2" className='tw-mt-2'>
            <Checkbox disabled />
            {t('global.grid')}
          </Flex>
        </Text>

        <Separator my="3" size="4" />

        <Text size="1">{t('global.display-items')}</Text>

        <Text as="label" size="1" color="gray">
          <Flex gap="2" className='tw-mt-2'>
            <Checkbox disabled />
            {t('global.page-number')}
          </Flex>
        </Text>
      </div>
    </ScrollArea>
  );
};
