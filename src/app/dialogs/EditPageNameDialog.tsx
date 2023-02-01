import { QueueButton } from 'components/button/Button';
import { QueueDialog } from 'components/dialog/Dialog';
import { QueueInput } from 'components/input/Input';
import { useState } from 'react';

export interface EditPageNameProps {
  pageName: string;
  onSubmit: (pageName: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditPageNameDialog: React.FC<EditPageNameProps> = ({
  pageName,
  onSubmit,
  open,
  onOpenChange,
}) => {
  const [currentPageName, setCurrentPageName] = useState(pageName);

  return (
    <QueueDialog.Root
      open={open}
      onOpenChange={onOpenChange}>
      <QueueDialog.Portal>
        <QueueDialog.Overlay />
        <QueueDialog.Content>
          <QueueDialog.Title>
            페이지 이름 수정
          </QueueDialog.Title>
          <form onSubmit={(): void => onSubmit(currentPageName)}>
            <QueueDialog.Description>
              <QueueInput
                required
                id="pagename"
                value={currentPageName}
                onChange={(e): void => setCurrentPageName(e.target.value)} />
            </QueueDialog.Description>
            <QueueDialog.Footer>
              <QueueButton
                type="button"
                size='small'
                color='red'
                onClick={(): void => onOpenChange(false)}>
                취소
              </QueueButton>
              <QueueButton
                type="submit"
                size='small'
                color='blue'>
                확인
              </QueueButton>
            </QueueDialog.Footer>
          </form>
        </QueueDialog.Content>
      </QueueDialog.Portal>
    </QueueDialog.Root>
  );
};