import { QueueDialog } from 'components/dialog/Dialog';
import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import { QueueInput } from 'components/input/Input';
import { QueueButton } from 'components/button/Button';

export interface NewDocumentDialogProps extends Omit<Dialog.DialogProps, 'children'> {
  onSubmit?: () => void;
}

export const NewDocumentDialog: React.FC<NewDocumentDialogProps> = ({
  onSubmit,
  ...props
}) => {
  return (
    <QueueDialog.Root {...props}>
      <QueueDialog.Portal>
        <QueueDialog.Overlay />
        <QueueDialog.Content>
          <QueueDialog.Title>
            새 문서 설정
          </QueueDialog.Title>
          <QueueDialog.Description>
            <QueueInput
              required />
          </QueueDialog.Description>
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
