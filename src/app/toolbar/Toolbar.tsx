import { ReactNode, useState } from 'react';
import styles from './Toolbar.module.scss';
import clsx from 'clsx';
import { QueueDocument } from 'model/document';
import { QueueMenubar } from 'components/menu-bar/Menubar';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { QueueAlertDialog, QueueSimpleAlertDialogProps } from 'components/alert-dialog/AlertDialog';
import { NewDocumentDialog, NewDocumentDialogProps } from 'app/new-document-dialog/NewDocumentDialog';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { DocumentSelectors } from 'store/document/selectors';
import { DocumentActions } from '../../store/document';
import { QueueH6 } from 'components/head/Head';
import { HistorySelectors } from 'store/history/selectors';
import { HistoryActions } from 'store/history';
import { SettingsActions } from 'store/settings';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { PreferencesSelectors } from 'store/preferences/selectors';
import { PreferencesActions } from 'store/preferences/actions';
import { SUPPORTED_LANGUAGES } from 'store/preferences/model';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { parseTheQueueFile } from 'cdk/functions/documentParser';

export interface ToolbarModel {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  children: ToolbarModel[];
}

export const QueueToolbar = () => {
  const { t, i18n } = useTranslation();
  const history = useAppSelector(HistorySelectors.all);
  const docs = useAppSelector(DocumentSelectors.document);
  const dispatch = useAppDispatch();
  const preferences = useAppSelector(PreferencesSelectors.all);
  const serializedDocumentModel = useAppSelector(DocumentSelectors.serialized);

  const [alertDialog, setAlertDialog] = useState<QueueSimpleAlertDialogProps>(null);
  const [newDocumentDialogProps, setNewDocumentDialogProps] = useState<NewDocumentDialogProps>(null);

  const onNewDocumentClick = (): void => {
    if (docs) {
      setAlertDialog({
        title: t('global.data-loss-warning-title'),
        description: t('global.data-loss-warning'),
        onAction: () =>
          setNewDocumentDialogProps({
            onSubmit: (document) => dispatch(DocumentActions.loadDocument(document)),
          }),
      });
      return;
    }
    setNewDocumentDialogProps({
      onSubmit: (document) => dispatch(DocumentActions.loadDocument(document)),
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
        parseTheQueueFile(file);
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

  const onOpenDcoumentClick = (): void => {
    if (docs) {
      setAlertDialog({
        title: t('global.data-loss-warning-title'),
        description: t('global.data-loss-warning'),
        onAction: startFileChooser,
      });
      return;
    }
    startFileChooser();
  };

  const onSaveDocumentClick = (): void => {
    if (!docs) return;
    const stringified = JSON.stringify(serializedDocumentModel);
    const blob = new Blob([stringified], { type: 'octet/stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${serializedDocumentModel.documentName}.que`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearDocument = (): void => {
    dispatch(DocumentActions.loadDocument(null));
  };

  const onCloseDocumentClick = (): void => {
    if (docs) {
      setAlertDialog({
        title: t('global.data-loss-warning-title'),
        description: t('global.data-loss-warning'),
        onAction: clearDocument,
      });
      return;
    }
    clearDocument();
  };

  return (
    <div className={clsx(styles.Container)}>
      <div className={clsx(styles.LogoContainer)}>
        <SvgRemixIcon icon="ri-file-ppt-line" size={QUEUE_UI_SIZE.XLARGE} />
      </div>
      <div className={clsx(styles.ContentContainer)}>
        <div className={clsx(styles.TitleContainer)}>
          <QueueH6>{docs?.documentName}</QueueH6>
        </div>
        <QueueMenubar.Root>
          <QueueMenubar.Menu>
            <QueueMenubar.Trigger>{t('toolbar.file')}</QueueMenubar.Trigger>
            <QueueMenubar.Portal>
              <QueueMenubar.Content align="start">
                <QueueMenubar.Item onClick={onNewDocumentClick}>{t('toolbar.file.new-document')}</QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item onClick={onOpenDcoumentClick}>{t('toolbar.file.open-document')}</QueueMenubar.Item>
                <QueueMenubar.Item onClick={onSaveDocumentClick} disabled={!docs}>
                  {t('toolbar.file.save-document')}
                </QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item onClick={onCloseDocumentClick} disabled={!docs}>
                  {t('toolbar.file.close-document')}
                </QueueMenubar.Item>
              </QueueMenubar.Content>
            </QueueMenubar.Portal>
          </QueueMenubar.Menu>

          <QueueMenubar.Menu>
            <QueueMenubar.Trigger>{t('toolbar.edit')}</QueueMenubar.Trigger>
            <QueueMenubar.Portal>
              <QueueMenubar.Content align="start">
                <QueueMenubar.Item
                  disabled={!docs || history.previous.length === 0}
                  onClick={() => dispatch(HistoryActions.Undo())}>
                  {t('global.undo')}
                </QueueMenubar.Item>
                <QueueMenubar.Item
                  disabled={!docs || history.future.length === 0}
                  onClick={() => dispatch(HistoryActions.Redo())}>
                  {t('global.redo')}
                </QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item disabled={!docs || true}>{t('toolbar.edit.edit-title')}</QueueMenubar.Item>
                <QueueMenubar.Item disabled={!docs || true}>{t('toolbar.edit.page-settings')}</QueueMenubar.Item>
              </QueueMenubar.Content>
            </QueueMenubar.Portal>
          </QueueMenubar.Menu>

          <QueueMenubar.Menu>
            <QueueMenubar.Trigger>{t('toolbar.view')}</QueueMenubar.Trigger>
            <QueueMenubar.Portal>
              <QueueMenubar.Content align="start">
                <QueueMenubar.Item disabled={!docs} onClick={() => dispatch(SettingsActions.setPresentationMode(true))}>
                  {t('toolbar.view.start-presentation-mode')}
                </QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item disabled>{t('toolbar.view.full-screen')}</QueueMenubar.Item>
              </QueueMenubar.Content>
            </QueueMenubar.Portal>
          </QueueMenubar.Menu>

          <QueueMenubar.Menu>
            <QueueMenubar.Trigger>{t('toolbar.extra')}</QueueMenubar.Trigger>
            <QueueMenubar.Portal>
              <QueueMenubar.Content align="start">
                <QueueMenubar.Sub>
                  <QueueMenubar.SubTrigger>
                    {t('toolbar.extra.language')}
                    <QueueMenubar.RightSlot>
                      <ChevronRightIcon />
                    </QueueMenubar.RightSlot>
                  </QueueMenubar.SubTrigger>
                  <QueueMenubar.Portal>
                    <QueueMenubar.SubContent alignOffset={-5}>
                      <QueueMenubar.RadioGroup
                        value={preferences.language}
                        onValueChange={(rawValue) => {
                          const value = rawValue as SUPPORTED_LANGUAGES;
                          i18n.changeLanguage(value !== 'auto' ? value : null);
                          dispatch(PreferencesActions.changeLanguage({ language: value }));
                        }}>
                        <QueueMenubar.RadioItem value="auto">
                          {t('toolbar.extra.language-auth')}
                          <QueueMenubar.ItemIndicator />
                        </QueueMenubar.RadioItem>
                        <QueueMenubar.RadioItem value="ko">
                          한국어
                          <QueueMenubar.ItemIndicator />
                        </QueueMenubar.RadioItem>
                        <QueueMenubar.RadioItem value="en">
                          English
                          <QueueMenubar.ItemIndicator />
                        </QueueMenubar.RadioItem>
                      </QueueMenubar.RadioGroup>
                    </QueueMenubar.SubContent>
                  </QueueMenubar.Portal>
                </QueueMenubar.Sub>
              </QueueMenubar.Content>
            </QueueMenubar.Portal>
          </QueueMenubar.Menu>

          <QueueMenubar.Menu>
            <QueueMenubar.Trigger>{t('toolbar.help')}</QueueMenubar.Trigger>
            <QueueMenubar.Portal>
              <QueueMenubar.Content align="start">
                <QueueMenubar.Item disabled>{t('toolbar.help.keyboard-shortcut')}</QueueMenubar.Item>
                <QueueMenubar.Item disabled>{t('toolbar.help.web-site')}</QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item disabled>{t('toolbar.help.check-update')}</QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item disabled>{t('toolbar.help.about')}</QueueMenubar.Item>
              </QueueMenubar.Content>
            </QueueMenubar.Portal>
          </QueueMenubar.Menu>
        </QueueMenubar.Root>
      </div>
      {alertDialog && (
        <QueueAlertDialog.SimpleAlert
          title={alertDialog.title}
          description={alertDialog.description}
          onAction={alertDialog.onAction}
          opened={!!alertDialog}
          onOpenChange={(opened): void => !opened && setAlertDialog(null)}
        />
      )}

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
