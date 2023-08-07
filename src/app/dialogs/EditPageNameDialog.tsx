import { QueueButton } from 'components/buttons/button/Button';
import { QueueDialog, QueueDialogRootRef } from 'components/dialog/Dialog';
import { QueueInput } from 'components/input/Input';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';

export interface EditPageNameProps {
  pageName: string;
  onSubmit: (pageName: string) => void;
}

export const EditPageNameDialog = ({ pageName, onSubmit }: EditPageNameProps) => {
  const { t } = useTranslation();
  const renderedRef = useRef<QueueDialogRootRef>();
  const [currentPageName, setCurrentPageName] = useState(pageName);

  return (
    <QueueDialog.Root ref={renderedRef}>
      <QueueDialog.Title>{t('edit-page-name-dialog.edit-page-name')}</QueueDialog.Title>
      <form
        onSubmit={(event): void => {
          event.preventDefault();
          onSubmit(currentPageName);
          renderedRef.current.close();
        }}>
        <QueueDialog.Description>
          <QueueInput
            required
            id="pagename"
            className="tw-border-solid tw-border-2 tw-border-gray-200 focus:tw-border-gray-400"
            value={currentPageName}
            onChange={(e): void => setCurrentPageName(e.target.value)}
          />
        </QueueDialog.Description>
        <QueueDialog.Footer>
          <QueueButton
            type="button"
            size={QUEUE_UI_SIZE.MEDIUM}
            color={QUEUE_UI_COLOR.RED}
            onClick={() => renderedRef.current.close()}>
            {t('global.cancel')}
          </QueueButton>
          <QueueButton type="submit" size={QUEUE_UI_SIZE.MEDIUM} color={QUEUE_UI_COLOR.BLUE}>
            {t('global.confirm')}
          </QueueButton>
        </QueueDialog.Footer>
      </form>
    </QueueDialog.Root>
  );
};
