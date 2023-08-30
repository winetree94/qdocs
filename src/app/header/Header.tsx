import { ReactNode, useState } from 'react';
import styles from 'app/header/Header.module.scss';
import clsx from 'clsx';
import { QueueMenubar } from 'components/menu-bar/Menubar';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { useAlertDialog } from 'components/alert-dialog/AlertDialog';
import { NewDocumentDialog } from 'app/new-document-dialog/NewDocumentDialog';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { DocumentSelectors } from 'store/document/selectors';
import { DocumentActions } from '../../store/document';
import { HistorySelectors } from 'store/history/selectors';
import { HistoryActions } from 'store/history';
import { SettingsActions } from 'store/settings';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { PreferencesSelectors } from 'store/preferences/selectors';
import { PreferencesActions } from 'store/preferences/actions';
import { SUPPORTED_LANGUAGES } from 'store/preferences/model';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import { useRootRenderer } from 'cdk/root-renderer/root-renderer';
import { RootState } from 'store';
import { QueueDropdown } from 'components/dropdown/Dropdown';
import { QueueButton } from 'components/buttons/button/Button';

export interface ToolbarModel {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  children: ToolbarModel[];
}

export const QueueHeader = () => {
  const { t, i18n } = useTranslation();
  // 불필요한 리렌더링을 막기 위해 useAppSelector로 셀렉한 값들을 사용할 때 구조분해 할당으로 가져온다. (나머지 상태는 업데이트 자체가 여러번 되는지 확인이 필요)
  const { previous, future } = useAppSelector(HistorySelectors.all);
  const docs = useAppSelector(DocumentSelectors.document);
  const dispatch = useAppDispatch();
  const alertDialog = useAlertDialog();
  const preferences = useAppSelector(PreferencesSelectors.all);
  const serializedDocumentModel = useAppSelector(DocumentSelectors.serialized);
  const rootRenderer = useRootRenderer();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const onPresentationStartClick = (): void => {
    dispatch(SettingsActions.setPresentationMode(true));
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
      <QueueDropdown open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <QueueDropdown.Trigger className="tw-flex tw-items-center tw-p-3 tw-gap-1">
          <div className={clsx(styles.LogoContainer)}>.Qdocs</div>
          <ChevronDownIcon
            className={clsx(
              'tw-w-5',
              'tw-h-5',
              'tw-transition-all',
              'tw-duration-300',
              {
                'tw-scale-y-[1]': !isDropdownOpen,
                'tw-scale-y-[-1]': isDropdownOpen,
              },
            )}
          />
        </QueueDropdown.Trigger>

        <QueueDropdown.Content align="center">
          <QueueDropdown.Sub>
            <QueueDropdown.SubTrigger className="tw-py-2 tw-px-6">
              {t('toolbar.file')}
            </QueueDropdown.SubTrigger>
            <QueueDropdown.SubContent>
              <QueueDropdown.Item onClick={onNewDocumentClick}>
                {t('toolbar.file.new-document')}
              </QueueDropdown.Item>
              <QueueMenubar.Separator />
              <QueueDropdown.Item onClick={onOpenDocumentClick}>
                {t('toolbar.file.open-document')}
              </QueueDropdown.Item>
              <QueueDropdown.Item
                onClick={onSaveDocumentClick}
                disabled={!docs}>
                {t('toolbar.file.save-document')}
              </QueueDropdown.Item>
              <QueueDropdown.Separator />
              <QueueDropdown.Item
                onClick={onCloseDocumentClick}
                disabled={!docs}>
                {t('toolbar.file.close-document')}
              </QueueDropdown.Item>
            </QueueDropdown.SubContent>
          </QueueDropdown.Sub>

          <QueueDropdown.Sub>
            <QueueDropdown.SubTrigger className="tw-py-2 tw-px-6">
              {t('toolbar.edit')}
            </QueueDropdown.SubTrigger>
            <QueueDropdown.SubContent>
              <QueueDropdown.Item
                disabled={!docs || previous.length === 0}
                onClick={() => dispatch(HistoryActions.Undo())}>
                {t('global.undo')}
              </QueueDropdown.Item>
              <QueueDropdown.Item
                disabled={!docs || future.length === 0}
                onClick={() => dispatch(HistoryActions.Redo())}>
                {t('global.redo')}
              </QueueDropdown.Item>
              <QueueDropdown.Separator />
              <QueueDropdown.Item disabled={!docs || true}>
                {t('toolbar.edit.edit-title')}
              </QueueDropdown.Item>
              <QueueDropdown.Item disabled={!docs || true}>
                {t('toolbar.edit.page-settings')}
              </QueueDropdown.Item>
            </QueueDropdown.SubContent>
          </QueueDropdown.Sub>

          <QueueDropdown.Sub>
            <QueueDropdown.SubTrigger className="tw-py-2 tw-px-6">
              {t('toolbar.view')}
            </QueueDropdown.SubTrigger>
            <QueueDropdown.SubContent>
              <QueueDropdown.Item
                disabled={!docs}
                onClick={() =>
                  dispatch(SettingsActions.setPresentationMode(true))
                }>
                {t('toolbar.view.start-presentation-mode')}
              </QueueDropdown.Item>
              <QueueDropdown.Separator />
              <QueueDropdown.Item disabled>
                {t('toolbar.view.full-screen')}
              </QueueDropdown.Item>
            </QueueDropdown.SubContent>
          </QueueDropdown.Sub>

          <QueueDropdown.Sub>
            <QueueDropdown.SubTrigger className="tw-py-2 tw-px-6">
              {t('toolbar.extra')}
            </QueueDropdown.SubTrigger>
            <QueueDropdown.SubContent>
              <QueueDropdown.Sub>
                <QueueDropdown.SubTrigger className="tw-flex tw-items-center tw-gap-1 tw-py-2 tw-px-6">
                  {t('toolbar.extra.language')}
                  <ChevronRightIcon />
                </QueueDropdown.SubTrigger>
                <QueueDropdown.SubContent alignOffset={-5}>
                  <QueueDropdown.RadioGroup
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
                    <QueueDropdown.RadioItem value="auto">
                      {t('toolbar.extra.language-auth')}
                      <QueueDropdown.ItemIndicator />
                    </QueueDropdown.RadioItem>
                    <QueueDropdown.RadioItem value="ko">
                      한국어
                      <QueueDropdown.ItemIndicator />
                    </QueueDropdown.RadioItem>
                    <QueueDropdown.RadioItem value="en">
                      English
                      <QueueDropdown.ItemIndicator />
                    </QueueDropdown.RadioItem>
                  </QueueDropdown.RadioGroup>
                </QueueDropdown.SubContent>
              </QueueDropdown.Sub>
            </QueueDropdown.SubContent>
          </QueueDropdown.Sub>

          <QueueDropdown.Sub>
            <QueueDropdown.SubTrigger className="tw-py-2 tw-px-6">
              {t('toolbar.help')}
            </QueueDropdown.SubTrigger>
            <QueueDropdown.SubContent>
              <QueueDropdown.Item disabled>
                {t('toolbar.help.keyboard-shortcut')}
              </QueueDropdown.Item>
              <QueueDropdown.Item disabled>
                {t('toolbar.help.web-site')}
              </QueueDropdown.Item>
              <QueueDropdown.Separator />
              <QueueDropdown.Item disabled>
                {t('toolbar.help.check-update')}
              </QueueDropdown.Item>
              <QueueDropdown.Separator />
              <QueueDropdown.Item disabled>
                {t('toolbar.help.about')}
              </QueueDropdown.Item>
            </QueueDropdown.SubContent>
          </QueueDropdown.Sub>
        </QueueDropdown.Content>
      </QueueDropdown>
      <div className={clsx(styles['title-container'])}>
        {docs?.documentName}
      </div>

      {/* presentation mode */}
      {docs && (
        <QueueButton
          className={clsx(
            styles['slide-button'],
            'tw-flex tw-items-center tw-gap-1',
          )}
          onClick={onPresentationStartClick}>
          <SvgRemixIcon icon={'ri-play-line'} size={QUEUE_UI_SIZE.MEDIUM} />
          <span className="tw-text-sm tw-font-medium">Present</span>
        </QueueButton>
      )}
    </div>
  );
};
