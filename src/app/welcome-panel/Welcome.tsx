import { NewDocumentDialog, NewDocumentDialogProps } from 'app/new-document-dialog/NewDocumentDialog';
import clsx from 'clsx';
import { QueueButton } from 'components/button/Button';
import { QueueH2 } from 'components/head/Head';
import { QueueDocument } from 'model/document';
import { useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import styles from './Welcome.module.scss';
import { DocumentActions } from '../../store/document';
import { useTranslation } from 'react-i18next';

export const Welcome: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [newDocumentDialogProps, setNewDocumentDialogProps] = useState<NewDocumentDialogProps>(null);

  const onNewDocumentClick = (): void => {
    setNewDocumentDialogProps({
      onSubmit: (document) => {
        dispatch(DocumentActions.loadDocument(document));
      },
    });
  };

  const startFileChooser = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    const onFileSelected = (): void => {
      try {
        if (!input.files) {
          return;
        }
        const file = input.files[0];
        if (!file) {
          return;
        }
        const fileReader = new FileReader();
        fileReader.onload = (e): void => {
          const result = e.target?.result as string;
          const document = JSON.parse(result) as QueueDocument;
          dispatch(DocumentActions.loadDocument(document));
        };
        fileReader.readAsText(file);
      } catch (e) {
        console.warn(e);
      }
    };
    input.addEventListener('change', onFileSelected, { once: true });
  };

  return (
    <div className={clsx(styles.Container)}>
      <QueueH2 className={clsx(styles.Header)}>The Queue</QueueH2>
      <div className={styles.ButtonGroup}>
        <QueueButton className={clsx(styles.ActionButton)} size="large" onClick={onNewDocumentClick}>
          {t('welcome.new-document')}
        </QueueButton>
        <QueueButton className={clsx(styles.ActionButton)} size="large" onClick={startFileChooser}>
          {t('welcome.open-document')}
        </QueueButton>
      </div>

      {newDocumentDialogProps && (
        <NewDocumentDialog
          {...newDocumentDialogProps}
          open={!!newDocumentDialogProps}
          onOpenChange={(opened): void => !opened && setNewDocumentDialogProps(null)}
        />
      )}
    </div>
  );
};
