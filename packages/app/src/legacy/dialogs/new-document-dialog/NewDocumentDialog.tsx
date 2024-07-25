import React, { useMemo } from 'react';
import clsx from 'clsx';
import styles from './NewDocumentDialog.module.scss';
import { TEMPLATES } from './templates.meta';
import { useTranslation } from 'react-i18next';
import { RootState } from '@legacy/store';
import { Button, Dialog, Flex } from '@radix-ui/themes';
import { useRootRenderedContext } from '@legacy/cdk/root-renderer/root-renderer';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';

export interface NewDocumentDialogProps {
  onSubmit?: (document: RootState) => void;
}

export const NewDocumentDialog = ({ onSubmit }: NewDocumentDialogProps) => {
  const { t } = useTranslation();
  const rootRendererContext = useRootRenderedContext();
  const [documentTemplate, setDocumentTemplate] =
    React.useState<string>('Empty');

  const [fetching, setFetching] = React.useState<boolean>(false);

  const templates = useMemo(() => TEMPLATES, []);

  const onSubmitClick = async (): Promise<void> => {
    if (fetching) {
      return;
    }
    try {
      const template = templates.find(
        (template) => template.name === documentTemplate,
      );
      if (!template) {
        console.warn('Template not found: ', documentTemplate);
        return;
      }
      setFetching(true);
      const document = await template.getTemplate();

      /**
       * TODO 언젠가 없애야함
       * 데이터 보완
       */
      document.effects.ids.forEach((id) => {
        const effect = document.effects.entities[id];
        const object = document.objects.entities[effect.objectId];
        effect.pageId = object.pageId;
      });

      document.objects.ids.forEach((id) => {
        const object = document.objects.entities[id];
        if (!object.uniqueColor) {
          object.uniqueColor = `#${Math.floor(
            Math.random() * 16777215,
          ).toString(16)}`;
        }
      });

      onSubmit?.(document);
    } finally {
      setFetching(false);
      rootRendererContext.close();
    }
  };

  const onDoubleClickItem = async (
    fetcher: () => Promise<RootState>,
  ): Promise<void> => {
    if (fetching) {
      return;
    }
    try {
      setFetching(true);
      const document = await fetcher();
      /**
       * TODO 언젠가 없애야함
       * 데이터 보완
       */
      document.effects.ids.forEach((id) => {
        const effect = document.effects.entities[id];
        const object = document.objects.entities[effect.objectId];
        effect.pageId = object.pageId;
      });

      document.objects.ids.forEach((id) => {
        const object = document.objects.entities[id];
        if (!object.uniqueColor) {
          object.uniqueColor = `#${Math.floor(
            Math.random() * 16777215,
          ).toString(16)}`;
        }
      });

      onSubmit?.(document);
    } finally {
      setFetching(false);
      rootRendererContext.close();
    }
  };

  return (
    <Dialog.Root open={true}>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title className='tw-mb-4'>
          {t('new-document.set-up-new-document-template')}
        </Dialog.Title>

        <Flex direction="column" gap="3">
          <ToggleGroup
            type="single"
            value={documentTemplate}
            onValueChange={(value): void =>
              value && setDocumentTemplate(value)
            }
            className={clsx(styles.TemplateGroup)}>
            {templates.map(({ name, getTemplate }) => (
              <ToggleGroupItem
                key={name}
                className={styles.TemplateItem}
                value={name}
                onDoubleClick={() => onDoubleClickItem(getTemplate)}>
                {name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" onClick={(): void => rootRendererContext.close()}>
              {t('global.cancel')}
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={onSubmitClick}>
              {t('global.create')}
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
