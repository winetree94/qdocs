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

export interface ToolbarModel {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  children: ToolbarModel[];
}

export const QueueToolbar = () => {
  const history = useAppSelector(HistorySelectors.all);
  const docs = useAppSelector(DocumentSelectors.document);
  const dispatch = useAppDispatch();
  const serializedDocumentModel = useAppSelector(DocumentSelectors.serialized);

  const [alertDialog, setAlertDialog] = useState<QueueSimpleAlertDialogProps>(null);
  const [newDocumentDialogProps, setNewDocumentDialogProps] = useState<NewDocumentDialogProps>(null);

  const onNewDocumentClick = (): void => {
    if (docs) {
      setAlertDialog({
        title: '현재 열려있는 문서가 있습니다.',
        description: '기존 문서의 모든 변경사항이 초기화됩니다. 계속하시겠습니까?',
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
        title: '현재 열려있는 문서가 있습니다.',
        description: '저장되지 않은 데이터가 삭제됩니다. 계속하시겠습니까?',
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
        title: '현재 열려있는 문서가 있습니다.',
        description: '저장되지 않은 데이터가 삭제됩니다. 계속하시겠습니까?',
        onAction: clearDocument,
      });
      return;
    }
    clearDocument();
  };

  return (
    <div className={clsx(styles.Container)}>
      <div className={clsx(styles.LogoContainer)}>
        <SvgRemixIcon icon="ri-file-ppt-line" width={40} height={40} />
      </div>
      <div className={clsx(styles.ContentContainer)}>
        <div className={clsx(styles.TitleContainer)}>
          <QueueH6>{docs?.documentName}</QueueH6>
        </div>
        <QueueMenubar.Root>
          <QueueMenubar.Menu>
            <QueueMenubar.Trigger>파일</QueueMenubar.Trigger>
            <QueueMenubar.Portal>
              <QueueMenubar.Content align="start">
                <QueueMenubar.Item onClick={onNewDocumentClick}>새 문서</QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item onClick={onOpenDcoumentClick}>문서 열기</QueueMenubar.Item>
                <QueueMenubar.Item onClick={onSaveDocumentClick} disabled={!docs}>
                  문서 저장
                </QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item onClick={onCloseDocumentClick} disabled={!docs}>
                  문서 닫기
                </QueueMenubar.Item>
              </QueueMenubar.Content>
            </QueueMenubar.Portal>
          </QueueMenubar.Menu>

          <QueueMenubar.Menu>
            <QueueMenubar.Trigger>수정</QueueMenubar.Trigger>
            <QueueMenubar.Portal>
              <QueueMenubar.Content align="start">
                <QueueMenubar.Item
                  disabled={!docs || history.previous.length === 0}
                  onClick={() => dispatch(HistoryActions.Undo())}>
                  실행 취소
                </QueueMenubar.Item>
                <QueueMenubar.Item
                  disabled={!docs || history.future.length === 0}
                  onClick={() => dispatch(HistoryActions.Redo())}>
                  다시 실행
                </QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item disabled={!docs || true}>붙여넣기</QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item disabled={!docs || true}>제목 수정</QueueMenubar.Item>
                <QueueMenubar.Item disabled={!docs || true}>페이지 설정</QueueMenubar.Item>
              </QueueMenubar.Content>
            </QueueMenubar.Portal>
          </QueueMenubar.Menu>

          <QueueMenubar.Menu>
            <QueueMenubar.Trigger>보기</QueueMenubar.Trigger>
            <QueueMenubar.Portal>
              <QueueMenubar.Content align="start">
                <QueueMenubar.Item disabled={!docs} onClick={() => dispatch(SettingsActions.setPresentationMode(true))}>
                  프레젠테이션 모드 시작
                </QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item disabled>전체 화면</QueueMenubar.Item>
              </QueueMenubar.Content>
            </QueueMenubar.Portal>
          </QueueMenubar.Menu>

          <QueueMenubar.Menu>
            <QueueMenubar.Trigger>도움말</QueueMenubar.Trigger>
            <QueueMenubar.Portal>
              <QueueMenubar.Content align="start">
                <QueueMenubar.Item disabled>키보드 단축키</QueueMenubar.Item>
                <QueueMenubar.Item disabled>웹 사이트</QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item disabled>업데이트 확인</QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item disabled>정보</QueueMenubar.Item>
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
