import { ReactNode } from 'react';
import styles from './Toolbar.module.scss';
import clsx from 'clsx';
import { QueueMenubar } from 'components/menu-bar/Menubar';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { useAlertDialog } from 'components/alert-dialog/AlertDialog';
import { NewDocumentDialog } from 'app/new-document-dialog/NewDocumentDialog';
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
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import { useRootRenderer } from 'cdk/root-renderer/root-renderer';
import { RootState } from 'store';

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
  const alertDialog = useAlertDialog();
  const preferences = useAppSelector(PreferencesSelectors.all);
  const serializedDocumentModel = useAppSelector(DocumentSelectors.serialized);
  const rootRenderer = useRootRenderer();

  const openNewDocumentDialog = () => {
    rootRenderer.render(
      <NewDocumentDialog
        onSubmit={(document) =>
          dispatch(DocumentActions.loadDocument(document))
        }
      />,
    );
  };

  const onNewDocumentClick = (): void => {
    if (docs) {
      alertDialog.open({
        title: t('global.data-loss-warning-title'),
        description: t('global.data-loss-warning'),
        buttons: [
          {
            label: t('global.cancel'),
            size: QUEUE_UI_SIZE.MEDIUM,
            color: QUEUE_UI_COLOR.RED,
          },
          {
            label: t('global.confirm'),
            size: QUEUE_UI_SIZE.MEDIUM,
            color: QUEUE_UI_COLOR.BLUE,
            onClick: openNewDocumentDialog,
          },
        ],
      });
      return;
    }
    openNewDocumentDialog();
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
        // parseTheQueueFile(file);
        const fileReader = new FileReader();
        fileReader.onload = (e): void => {
          const result = e.target?.result as string;
          const document = JSON.parse(result) as RootState;
          dispatch(DocumentActions.loadDocument(document));
        };
        fileReader.readAsText(file);
      } catch (e) {
        console.warn(e);
      }
    };
    input.addEventListener('change', onFileSelected, { once: true });
  };

  const onOpenDocumentClick = (): void => {
    if (docs) {
      alertDialog.open({
        title: t('global.data-loss-warning-title'),
        description: t('global.data-loss-warning'),
        buttons: [
          {
            label: t('global.cancel'),
            size: QUEUE_UI_SIZE.MEDIUM,
            color: QUEUE_UI_COLOR.RED,
          },
          {
            label: t('global.confirm'),
            size: QUEUE_UI_SIZE.MEDIUM,
            color: QUEUE_UI_COLOR.BLUE,
            onClick: startFileChooser,
          },
        ],
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
    a.download = `${serializedDocumentModel.document.documentName}.que`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearDocument = (): void => {
    dispatch(DocumentActions.loadDocument(null));
  };

  const onCloseDocumentClick = (): void => {
    if (docs) {
      alertDialog.open({
        title: t('global.data-loss-warning-title'),
        description: t('global.data-loss-warning'),
        buttons: [
          {
            label: t('global.cancel'),
            size: QUEUE_UI_SIZE.MEDIUM,
            color: QUEUE_UI_COLOR.RED,
          },
          {
            label: t('global.confirm'),
            size: QUEUE_UI_SIZE.MEDIUM,
            color: QUEUE_UI_COLOR.BLUE,
            onClick: clearDocument,
          },
        ],
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
                <QueueMenubar.Item onClick={onNewDocumentClick}>
                  {t('toolbar.file.new-document')}
                </QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item onClick={onOpenDocumentClick}>
                  {t('toolbar.file.open-document')}
                </QueueMenubar.Item>
                <QueueMenubar.Item
                  onClick={onSaveDocumentClick}
                  disabled={!docs}>
                  {t('toolbar.file.save-document')}
                </QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item
                  onClick={onCloseDocumentClick}
                  disabled={!docs}>
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
                <QueueMenubar.Item disabled={!docs || true}>
                  {t('toolbar.edit.edit-title')}
                </QueueMenubar.Item>
                <QueueMenubar.Item disabled={!docs || true}>
                  {t('toolbar.edit.page-settings')}
                </QueueMenubar.Item>
              </QueueMenubar.Content>
            </QueueMenubar.Portal>
          </QueueMenubar.Menu>

          <QueueMenubar.Menu>
            <QueueMenubar.Trigger>{t('toolbar.view')}</QueueMenubar.Trigger>
            <QueueMenubar.Portal>
              <QueueMenubar.Content align="start">
                <QueueMenubar.Item
                  disabled={!docs}
                  onClick={() =>
                    dispatch(SettingsActions.setPresentationMode(true))
                  }>
                  {t('toolbar.view.start-presentation-mode')}
                </QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item disabled>
                  {t('toolbar.view.full-screen')}
                </QueueMenubar.Item>
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
                        onValueChange={async (rawValue) => {
                          const value = rawValue as SUPPORTED_LANGUAGES;
                          await i18n.changeLanguage(
                            value !== 'auto' ? value : null,
                          );
                          dispatch(
                            PreferencesActions.changeLanguage({
                              language: value,
                            }),
                          );
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
                <QueueMenubar.Item disabled>
                  {t('toolbar.help.keyboard-shortcut')}
                </QueueMenubar.Item>
                <QueueMenubar.Item disabled>
                  {t('toolbar.help.web-site')}
                </QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item disabled>
                  {t('toolbar.help.check-update')}
                </QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item disabled>
                  {t('toolbar.help.about')}
                </QueueMenubar.Item>
              </QueueMenubar.Content>
            </QueueMenubar.Portal>
          </QueueMenubar.Menu>
        </QueueMenubar.Root>
      </div>
    </div>
  );
};
