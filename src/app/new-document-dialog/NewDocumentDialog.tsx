import { QueueDialog } from 'components/dialog/Dialog';
import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import { QueueButton } from 'components/button/Button';
import { QueueSelect } from 'components/select/Select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { QueueToggleGroup } from 'components/toggle-group/ToggleGroup';
import clsx from 'clsx';
import styles from './NewDocumentDialog.module.scss';

export interface NewDocumentDialogProps extends Omit<Dialog.DialogProps, 'children'> {
  onSubmit?: () => void;
}

export const NewDocumentDialog: React.FC<NewDocumentDialogProps> = ({
  onSubmit,
  ...props
}) => {

  const [documentRatio, setDocumentRatio] = React.useState<string>('16:9');
  const [documentTemplate, setDocumentTemplate] = React.useState<string>('empty');

  return (
    <QueueDialog.Root {...props}>
      <QueueDialog.Portal>
        <QueueDialog.Overlay />
        <QueueDialog.Content>
          <QueueDialog.Title>
            새 문서 설정
          </QueueDialog.Title>
          <div className={styles.Container}>
            <div className={styles.RatioContainer}>
              <h6>
                문서 크기 비율
              </h6>
              <QueueSelect.Root
                value={documentRatio}
                onValueChange={(value): void => setDocumentRatio(value)}
              >
                <QueueSelect.Trigger className={styles.RatioSelector} aria-label="Food">
                  <QueueSelect.Value />
                  <QueueSelect.Icon className="SelectIcon">
                    <ChevronDownIcon />
                  </QueueSelect.Icon>
                </QueueSelect.Trigger>
                <QueueSelect.Portal>
                  <QueueSelect.Content className="SelectContent">
                    <QueueSelect.Viewport className="SelectViewport">
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
                onValueChange={(value): void => setDocumentTemplate(value)}
                className={clsx(styles.TemplateGroup)}
              >
                <QueueToggleGroup.Item
                  className={styles.TemplateItem}
                  value="empty">
                  template
                </QueueToggleGroup.Item>
                <QueueToggleGroup.Item
                  value="2323"
                  className={styles.TemplateItem}>
                  template
                </QueueToggleGroup.Item>
                <QueueToggleGroup.Item
                  value="123213"
                  className={styles.TemplateItem}>
                  template
                </QueueToggleGroup.Item>
              </QueueToggleGroup.Root>
            </div>
          </div>
          {/* <QueueDialog.Description>
            <QueueInput
              required />
          </QueueDialog.Description> */}
          <QueueDialog.Footer>
            <QueueButton
              type="button"
              size='small'
              color='red'
              onClick={(): void => props.onOpenChange?.(false)}>
              취소
            </QueueButton>
            <QueueButton
              type="submit"
              size='small'
              color='blue'
              onClick={(): void => {
                onSubmit?.();
                props.onOpenChange?.(false);
              }}>
              확인
            </QueueButton>
          </QueueDialog.Footer>
        </QueueDialog.Content>
      </QueueDialog.Portal>
    </QueueDialog.Root>
  );
};
