import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import styles from './Toolbar.module.scss';
import { documentState } from 'store/document';
import { useRecoilState } from 'recoil';
import clsx from 'clsx';
import { QueueDocument } from 'model/document';
import { QueueMenubar } from 'components/menu-bar/Menubar';
import { QueueInput } from 'components/input/Input';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import {
  QueueAlertDialog,
  QueueSimpleAlertDialogProps,
} from 'components/alert-dialog/AlertDialog';
import {
  NewDocumentDialog,
  NewDocumentDialogProps,
} from 'app/new-document-dialog/NewDocumentDialog';

export interface ToolbarModel {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  children: ToolbarModel[];
}

export interface ToolbarProps {
  onItemClicked?: (item: ToolbarModel) => void;
}

export const QueueToolbar: FunctionComponent<ToolbarProps> = ({
  onItemClicked,
}) => {
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const [documentTitle, setDocumentTitle] = useState('');

  const [alertDialog, setAlertDialog] =
    useState<QueueSimpleAlertDialogProps>(null);
  const [newDocumentDialogProps, setNewDocumentDialogProps] =
    useState<NewDocumentDialogProps>(null);

  useEffect(() => {
    setDocumentTitle(queueDocument?.documentName || '');
  }, [queueDocument?.documentName]);

  const onTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setDocumentTitle(event.target.value);
  };

  const onTitleInputBlur = (): void => {
    const previous = (queueDocument?.documentName || '').trim();
    const current = documentTitle.trim();
    if (previous !== current) {
      setQueueDocument({
        ...queueDocument!,
        documentName: current,
      });
    }
  };

  const onNewDocumentClick = (): void => {
    if (queueDocument) {
      setAlertDialog({
        title: '현재 열려있는 문서가 있습니다.',
        description:
          '기존 문서의 모든 변경사항이 초기화됩니다. 계속하시겠습니까?',
        onAction: () =>
          setNewDocumentDialogProps({
            onSubmit: (document) => setQueueDocument(document),
          }),
      });
      return;
    }
    setNewDocumentDialogProps({
      onSubmit: (document) => setQueueDocument(document),
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
          setQueueDocument(document);
        };
        fileReader.readAsText(file);
      } catch (e) {
        console.warn(e);
      }
    };
    input.addEventListener('change', onFileSelected, { once: true });
  };

  const onOpenDcoumentClick = (): void => {
    if (queueDocument) {
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
    if (!queueDocument) return;
    const stringified = JSON.stringify(queueDocument);
    const blob = new Blob([stringified], { type: 'octet/stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${queueDocument.documentName}.que`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearDocument = (): void => {
    setQueueDocument(null);
  };

  const onCloseDocumentClick = (): void => {
    if (queueDocument) {
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
          <QueueInput
            disabled={!queueDocument}
            type="text"
            value={documentTitle}
            onChange={onTitleInputChange}
            onBlur={onTitleInputBlur}
          />
        </div>
        <QueueMenubar.Root>
          <QueueMenubar.Menu>
            <QueueMenubar.Trigger>파일</QueueMenubar.Trigger>
            <QueueMenubar.Portal>
              <QueueMenubar.Content align="start">
                <QueueMenubar.Item onClick={onNewDocumentClick}>
                  새 문서
                </QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item onClick={onOpenDcoumentClick}>
                  문서 열기
                </QueueMenubar.Item>
                <QueueMenubar.Item onClick={onSaveDocumentClick}>
                  문서 저장
                </QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item onClick={onCloseDocumentClick}>
                  문서 닫기
                </QueueMenubar.Item>
              </QueueMenubar.Content>
            </QueueMenubar.Portal>
          </QueueMenubar.Menu>

          <QueueMenubar.Menu>
            <QueueMenubar.Trigger>수정</QueueMenubar.Trigger>
            <QueueMenubar.Portal>
              <QueueMenubar.Content align="start">
                <QueueMenubar.Item>실행 취소</QueueMenubar.Item>
                <QueueMenubar.Item>다시 실행</QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item>붙여넣기</QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item>제목 수정</QueueMenubar.Item>
                <QueueMenubar.Item>페이지 설정</QueueMenubar.Item>
              </QueueMenubar.Content>
            </QueueMenubar.Portal>
          </QueueMenubar.Menu>

          <QueueMenubar.Menu>
            <QueueMenubar.Trigger>보기</QueueMenubar.Trigger>
            <QueueMenubar.Portal>
              <QueueMenubar.Content align="start">
                <QueueMenubar.Item>프레젠테이션 모드 시작</QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item>전체 화면</QueueMenubar.Item>
              </QueueMenubar.Content>
            </QueueMenubar.Portal>
          </QueueMenubar.Menu>

          <QueueMenubar.Menu>
            <QueueMenubar.Trigger>도움말</QueueMenubar.Trigger>
            <QueueMenubar.Portal>
              <QueueMenubar.Content align="start">
                <QueueMenubar.Item>키보드 단축키</QueueMenubar.Item>
                <QueueMenubar.Item>웹 사이트</QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item>업데이트 확인</QueueMenubar.Item>
                <QueueMenubar.Separator />
                <QueueMenubar.Item>정보</QueueMenubar.Item>
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
          onOpenChange={(opened): void =>
            !opened && setNewDocumentDialogProps(null)
          }
        />
      )}
    </div>
  );
};
