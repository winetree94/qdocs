import { QueueButton } from 'components/button/Button';
import { QueueDialog } from 'components/dialog/Dialog';
import { QueueInput } from 'components/input/Input';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';

export interface EditPageNameProps {
  pageName: string;
  onSubmit: (pageName: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditPageNameDialog: React.FC<EditPageNameProps> = ({ pageName, onSubmit, open, onOpenChange }) => {
  const { t } = useTranslation();
  const [currentPageName, setCurrentPageName] = useState(pageName);

  return (
    <QueueDialog.Root open={open} onOpenChange={onOpenChange}>
      <QueueDialog.Portal>
        <QueueDialog.Overlay />
        <QueueDialog.Content>
          <QueueDialog.Title>{t('edit-page-name-dialog.edit-page-name')}</QueueDialog.Title>
          <form onSubmit={(): void => onSubmit(currentPageName)}>
            <QueueDialog.Description>
              <QueueInput
                required
                id="pagename"
                value={currentPageName}
                onChange={(e): void => setCurrentPageName(e.target.value)}
              />
            </QueueDialog.Description>
            <QueueDialog.Footer>
              <QueueButton
                type="button"
                size={QUEUE_UI_SIZE.MEDIUM}
                color={QUEUE_UI_COLOR.RED}
                onClick={(): void => onOpenChange(false)}>
                {t('global.cancel')}
              </QueueButton>
              <QueueButton type="submit" size={QUEUE_UI_SIZE.MEDIUM} color={QUEUE_UI_COLOR.BLUE}>
                {t('global.confirm')}
              </QueueButton>
            </QueueDialog.Footer>
          </form>
        </QueueDialog.Content>
      </QueueDialog.Portal>
    </QueueDialog.Root>
  );
};
