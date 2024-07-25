import { memo, ReactNode } from 'react';
import { NewDocumentDialog } from '@legacy/app/new-document-dialog/NewDocumentDialog';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { DocumentSelectors } from '@legacy/store/document/selectors';
import { DocumentActions } from '../../store/document';
import { HistorySelectors } from '@legacy/store/history/selectors';
import { HistoryActions } from '@legacy/store/history';
import { SettingsActions } from '@legacy/store/settings';
import { useTranslation } from 'react-i18next';
import { PreferencesSelectors } from '@legacy/store/preferences/selectors';
import { PreferencesActions } from '@legacy/store/preferences/actions';
import { SUPPORTED_LANGUAGES } from '@legacy/store/preferences/model';
import { useRootRenderedContext, useRootRenderer } from '@legacy/cdk/root-renderer/root-renderer';
import { RootState, store } from '@legacy/store';
import { RiPlayLine } from '@remixicon/react';
import { AlertDialog, Button, DropdownMenu, Flex, Text } from '@radix-ui/themes';

export interface ToolbarModel {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  children: ToolbarModel[];
}

const WarnAlert = ({
  onConfirm
}: {
  onConfirm: () => void;
}) => {
  const { t } = useTranslation();
  const rootRendererContext = useRootRenderedContext();

  const onConfirmClick = () => {
    onConfirm();
    rootRendererContext.close();
  }

  return (
    <AlertDialog.Root open={true}>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{t('global.data-loss-warning-title')}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {t('global.data-loss-warning')}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel onClick={() => rootRendererContext.close()}>
            <Button variant="soft" color="gray">
              {t('global.cancel')}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action onClick={onConfirmClick}>
            <Button variant="solid" color="red">
              {t('global.confirm')}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export const QueueHeader = memo(function QueueHeader() {
  const { t } = useTranslation();
  // 불필요한 리렌더링을 막기 위해 useAppSelector로 셀렉한 값들을 사용할 때 구조분해 할당으로 가져온다. (나머지 상태는 업데이트 자체가 여러번 되는지 확인이 필요)
  const { previous, future } = useAppSelector(HistorySelectors.all);
  const dispatch = useAppDispatch();
  const preferences = useAppSelector(PreferencesSelectors.all);
  const rootRenderer = useRootRenderer();

  const docId = useAppSelector(DocumentSelectors.documentId);
  const docName = useAppSelector(DocumentSelectors.documentName);

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
    const docs = DocumentSelectors.document(store.getState());
    if (docs) {
      rootRenderer.render(
        <WarnAlert onConfirm={openNewDocumentDialog} />
      )
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
    const docs = DocumentSelectors.document(store.getState());
    if (docs) {
      rootRenderer.render(
        <WarnAlert onConfirm={startFileChooser} />
      )
      return;
    }
    startFileChooser();
  };

  const onPresentationStartClick = (): void => {
    dispatch(SettingsActions.setPresentationMode(true));
  };

  const onSaveDocumentClick = (): void => {
    const docs = DocumentSelectors.document(store.getState());
    if (!docs) return;
    const serializedDocumentModel = DocumentSelectors.serialized(
      store.getState(),
    );
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
    const docs = DocumentSelectors.document(store.getState());
    if (docs) {
      rootRenderer.render(
        <WarnAlert onConfirm={clearDocument} />
      )
      return;
    }
    clearDocument();
  };

  return (
    <Flex justify={'between'} className='tw-p-2'>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="solid">
            .Qdocs
            {/* <DropdownMenu.TriggerIcon /> */}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{t('toolbar.file')}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={onNewDocumentClick}>{t('toolbar.file.new-document')}</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onClick={onOpenDocumentClick}>{t('toolbar.file.open-document')}</DropdownMenu.Item>
              <DropdownMenu.Item onClick={onSaveDocumentClick}
                disabled={!docId}>{t('toolbar.file.save-document')}</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onClick={onCloseDocumentClick}
                disabled={!docId}>{t('toolbar.file.close-document')}</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{t('toolbar.edit')}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item
                disabled={!docId || previous.length === 0}
                onClick={() => dispatch(HistoryActions.Undo())}>
                {t('global.undo')}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                disabled={!docId || future.length === 0}
                onClick={() => dispatch(HistoryActions.Redo())}>
                {t('global.redo')}
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item disabled={!docId || true}>
                {t('toolbar.edit.edit-title')}
              </DropdownMenu.Item>
              <DropdownMenu.Item disabled={!docId || true}>
                {t('toolbar.edit.page-settings')}
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{t('toolbar.view')}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item
                disabled={!docId}
                onClick={() =>
                  dispatch(SettingsActions.setPresentationMode(true))
                }>
                {t('toolbar.view.start-presentation-mode')}
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item disabled>
                {t('toolbar.view.full-screen')}
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{t('toolbar.extra')}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>{t('toolbar.extra.language')}</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.RadioGroup
                    value={preferences.language}
                    onValueChange={(rawValue) => {
                      const value = rawValue as SUPPORTED_LANGUAGES;
                      dispatch(
                        PreferencesActions.changeLanguage({
                          language: value,
                        }),
                      );
                    }}>
                    <DropdownMenu.RadioItem value="auto">
                      {t('toolbar.extra.language-auth')}
                    </DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem value="ko">
                      한국어
                    </DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem value="en">
                      English
                    </DropdownMenu.RadioItem>
                  </DropdownMenu.RadioGroup>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{t('toolbar.help')}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item disabled>
                {t('toolbar.help.keyboard-shortcut')}
              </DropdownMenu.Item>
              <DropdownMenu.Item disabled>
                {t('toolbar.help.web-site')}
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item disabled>
                {t('toolbar.help.check-update')}
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item disabled>
                {t('toolbar.help.about')}
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <Text>
        {docName}
      </Text>

      {/* presentation mode */}
      {docId && (
        <Button
          onClick={onPresentationStartClick}>
          <RiPlayLine size={16} />
          Present
        </Button>
      )}
    </Flex>
  );
});
