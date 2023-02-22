import { NewDocumentDialog, NewDocumentDialogProps } from 'app/new-document-dialog/NewDocumentDialog';
import clsx from 'clsx';
import { QueueButton } from 'components/button/Button';
import { QueueH2 } from 'components/head/Head';
import { QueueDocument } from 'model/document';
import { useState } from 'react';
import { loadDocument } from 'store/document/actions';
import { useAppDispatch } from 'store/hooks';
import styles from './Welcome.module.scss';

export const Welcome: React.FC = () => {
  const dispatch = useAppDispatch();
  const [newDocumentDialogProps, setNewDocumentDialogProps] = useState<NewDocumentDialogProps>(null);

  const onNewDocumentClick = (): void => {
    setNewDocumentDialogProps({
      onSubmit: (document) => {
        dispatch(loadDocument(document));
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
          dispatch(loadDocument(document));
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
          새 문서
        </QueueButton>
        <QueueButton className={clsx(styles.ActionButton)} size="large" onClick={startFileChooser}>
          문서 열기
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
