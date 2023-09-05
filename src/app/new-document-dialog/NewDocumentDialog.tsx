import { QueueDialog, QueueDialogRootRef } from 'components/dialog/Dialog';
import React, { useMemo, useRef } from 'react';
import { QueueButton } from 'components/buttons/button/Button';
import { QueueToggleGroup } from 'components/toggle-group/ToggleGroup';
import clsx from 'clsx';
import styles from './NewDocumentDialog.module.scss';
import { TEMPLATES } from './templates.meta';
import { useTranslation } from 'react-i18next';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import { QueueSelect } from 'components/select/Select';
import { RootState } from 'store';

export interface NewDocumentDialogProps {
  onSubmit?: (document: RootState) => void;
}

export const NewDocumentDialog = ({ onSubmit }: NewDocumentDialogProps) => {
  const { t } = useTranslation();
  const dialogRef = useRef<QueueDialogRootRef>();
  const [documentRatio, setDocumentRatio] = React.useState<string>('16:9');
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

      onSubmit?.(document);
    } finally {
      setFetching(false);
      dialogRef.current.close();
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

      onSubmit?.(document);
    } finally {
      setFetching(false);
      dialogRef.current.close();
    }
  };

  return (
    <QueueDialog.Root ref={dialogRef}>
      <QueueDialog.Title>
        {t('new-document.set-up-new-document-template')}
      </QueueDialog.Title>
      <QueueDialog.Description>
        <div className={styles.Container}>
          <div className={styles.RatioContainer} style={{ display: 'none' }}>
            <h6>문서 크기 비율</h6>
            <QueueSelect
              value={documentRatio}
              onValueChange={(value): void => setDocumentRatio(value)}>
              <QueueSelect.Group>
                <QueueSelect.Option value="16:9">
                  와이드 (16:9)
                </QueueSelect.Option>
                <QueueSelect.Option value="16:10">
                  와이드 (16:10)
                </QueueSelect.Option>
                <QueueSelect.Option value="4:3">35mm (4:3)</QueueSelect.Option>
              </QueueSelect.Group>
            </QueueSelect>
          </div>
          <div className={styles.TemplateContainer}>
            <QueueToggleGroup.Root
              type="single"
              value={documentTemplate}
              onValueChange={(value): void =>
                value && setDocumentTemplate(value)
              }
              className={clsx(styles.TemplateGroup)}>
              {templates.map(({ name, getTemplate }) => (
                <QueueToggleGroup.Item
                  key={name}
                  className={styles.TemplateItem}
                  value={name}
                  onDoubleClick={() => onDoubleClickItem(getTemplate)}>
                  {name}
                </QueueToggleGroup.Item>
              ))}
            </QueueToggleGroup.Root>
          </div>
        </div>
      </QueueDialog.Description>
      <QueueDialog.Footer>
        <QueueButton
          type="button"
          size={QUEUE_UI_SIZE.MEDIUM}
          color={QUEUE_UI_COLOR.RED}
          onClick={(): void => dialogRef.current.close()}>
          {t('global.cancel')}
        </QueueButton>
        <QueueButton
          type="button"
          size={QUEUE_UI_SIZE.MEDIUM}
          color={QUEUE_UI_COLOR.BLUE}
          onClick={onSubmitClick}>
          {t('global.create')}
        </QueueButton>
      </QueueDialog.Footer>
    </QueueDialog.Root>
  );
};
