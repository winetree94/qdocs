import { QueueDialog } from 'components/dialog/Dialog';
import * as Dialog from '@radix-ui/react-dialog';
import React, { useMemo } from 'react';
import { QueueButton } from 'components/button/Button';
import { QueueSelect } from 'components/select/Select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { QueueToggleGroup } from 'components/toggle-group/ToggleGroup';
import clsx from 'clsx';
import styles from './NewDocumentDialog.module.scss';
import { TEMPLATES } from './templates.meta';
import { QueueDocument } from 'model/document';
import { useTranslation } from 'react-i18next';

export interface NewDocumentDialogProps extends Omit<Dialog.DialogProps, 'children'> {
  onSubmit?: (document: QueueDocument) => void;
}

export const NewDocumentDialog: React.FC<NewDocumentDialogProps> = ({ onSubmit, ...props }) => {
  const { t } = useTranslation();
  const [documentRatio, setDocumentRatio] = React.useState<string>('16:9');
  const [documentTemplate, setDocumentTemplate] = React.useState<string>('Empty');

  const [fetching, setFetching] = React.useState<boolean>(false);

  const templates = useMemo(() => TEMPLATES, []);

  const onSubmitClick = async (): Promise<void> => {
    if (fetching) {
      return;
    }
    try {
      const template = templates.find((template) => template.name === documentTemplate);
      if (!template) {
        console.warn('Template not found: ', documentTemplate);
        return;
      }
      setFetching(true);
      const document = await template.getTemplate();
      onSubmit?.(document);
      props.onOpenChange?.(false);
    } finally {
      setFetching(false);
    }
  };

  const onDoubleClickItem = async (fetcher: () => Promise<QueueDocument>): Promise<void> => {
    if (fetching) {
      return;
    }
    try {
      setFetching(true);
      const document = await fetcher();
      onSubmit?.(document);
      props.onOpenChange?.(false);
    } finally {
      setFetching(false);
    }
  };

  return (
    <QueueDialog.Root {...props}>
      <QueueDialog.Portal>
        <QueueDialog.Overlay />
        <QueueDialog.Content>
          <QueueDialog.Title>{t('new-document.set-up-new-document-template')}</QueueDialog.Title>
          <div className={styles.Container}>
            <div className={styles.RatioContainer} style={{ display: 'none' }}>
              <h6>문서 크기 비율</h6>
              <QueueSelect.Root value={documentRatio} onValueChange={(value): void => setDocumentRatio(value)}>
                <QueueSelect.Trigger className={styles.RatioSelector} aria-label="Food">
                  <QueueSelect.Value />
                  <QueueSelect.Icon>
                    <ChevronDownIcon />
                  </QueueSelect.Icon>
                </QueueSelect.Trigger>
                <QueueSelect.Portal>
                  <QueueSelect.Content>
                    <QueueSelect.Viewport>
                      <QueueSelect.Group>
                        <QueueSelect.Item value="16:9">와이드 (16:9)</QueueSelect.Item>
                        <QueueSelect.Item value="16:10">와이드 (16:10)</QueueSelect.Item>
                        <QueueSelect.Item value="4:3">35mm (4:3)</QueueSelect.Item>
                      </QueueSelect.Group>
                    </QueueSelect.Viewport>
                  </QueueSelect.Content>
                </QueueSelect.Portal>
              </QueueSelect.Root>
            </div>
            <div className={styles.TemplateContainer}>
              <QueueToggleGroup.Root
                type="single"
                value={documentTemplate}
                onValueChange={(value): void => value && setDocumentTemplate(value)}
                className={clsx(styles.TemplateGroup)}>
                {templates.map(({ name, getTemplate }) => (
                  <QueueToggleGroup.Item
                    key={name}
                    className={styles.TemplateItem}
                    value={name}
                    onDoubleClick={(): Promise<void> => onDoubleClickItem(getTemplate)}>
                    {name}
                  </QueueToggleGroup.Item>
                ))}
              </QueueToggleGroup.Root>
            </div>
          </div>
          <QueueDialog.Footer>
            <QueueButton type="button" size="small" color="red" onClick={(): void => props.onOpenChange?.(false)}>
              {t('global.cancel')}
            </QueueButton>
            <QueueButton type="button" size="small" color="blue" onClick={onSubmitClick}>
              {t('global.create')}
            </QueueButton>
          </QueueDialog.Footer>
        </QueueDialog.Content>
      </QueueDialog.Portal>
    </QueueDialog.Root>
  );
};
