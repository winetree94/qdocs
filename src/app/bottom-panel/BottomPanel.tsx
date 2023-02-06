import clsx from 'clsx';
import { QueueIconButton } from 'components/button/Button';
import { FunctionComponent, ReactNode, useState } from 'react';
import { useRecoilState } from 'recoil';
import { documentState } from 'store/document';
import { QueueContextMenu } from 'components/context-menu/Context';
import styles from './BottomPanel.module.scss';
import { QueueToggleGroup } from 'components/toggle-group/ToggleGroup';
import { useSettings } from 'cdk/hooks/settings';
import { EditPageNameDialog } from 'app/dialogs/EditPageNameDialog';
import { QueueAlertDialog } from 'components/alert-dialog/AlertDialog';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { cloneDeep } from 'lodash';

export interface BottomPanelProps {
  children?: ReactNode;
}

export const BottomPanel: FunctionComponent<BottomPanelProps> = ({
  children,
}) => {
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const { settings, ...setSettings } = useSettings();
  const [dragOverIndex, setDragOverIndex] = useState(-1);

  const [editNamePageIndex, setEditNamePageIndex] = useState<number>(-1);
  const [deleteConfirmPageIndex, setDeleteConfirmPageIndex] = useState<number>(-1);

  const navigatePage = (index: number): void => {
    setSettings.setQueuePageIndex(index);
  };

  const movePage = (from: number, to: number): void => {
    const pages = [...queueDocument!.pages];
    const page = pages[from];
    pages.splice(from, 1);
    pages.splice(to, 0, page);
    setQueueDocument({
      ...queueDocument!,
      pages,
    });
    setSettings.setQueuePageIndex(to);
  };

  const createPage = (index: number): void => {
    const pages = [...queueDocument!.pages];
    pages.splice(index, 0, {
      pageName: `Page-${pages.length + 1}`,
      objects: [],
    });
    setQueueDocument({
      ...queueDocument!,
      pages,
    });
    setSettings.setQueuePageIndex(index);
  };

  const removePage = (index: number): void => {
    const pages = [...queueDocument!.pages];
    pages.splice(index, 1);
    setQueueDocument({
      ...queueDocument!,
      pages,
    });
    setSettings.setQueuePageIndex(Math.min(index, pages.length - 1));
  };

  const onDragStart = (
    e: React.DragEvent<HTMLSpanElement>,
    index: number,
  ): void => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>): boolean => {
    e.preventDefault();
    return false;
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    const from = Number(e.dataTransfer.getData('text/plain'));
    if (!e.currentTarget || !e.currentTarget.classList.contains('page-item')) {
      return;
    }
    const to = Number(e.currentTarget.getAttribute('data-index'));
    movePage(from, to);
  };

  const onPageNameEdit = (pageName: string, index: number): void => {
    const pages = [...queueDocument!.pages];
    pages[index] = {
      ...pages[index],
      pageName: pageName.trim(),
    };
    setQueueDocument({
      ...queueDocument!,
      pages,
    });
    setEditNamePageIndex(-1);
  };

  const onPageCopy = (index: number): void => {
    const cloned = cloneDeep(queueDocument.pages[index]);
    cloned.pageName = `${cloned.pageName} (copy)`;
    const pages = [...queueDocument!.pages];
    setQueueDocument({
      ...queueDocument!,
      pages: [...pages.slice(0, index + 1), cloned, ...pages.slice(index + 1)],
    });
    setSettings.setQueuePageIndex(index + 1);
  };

  const onPageDeleteSubmit = (index: number): void => {
    removePage(index);
    setDeleteConfirmPageIndex(-1);
  };

  return (
    <div className={clsx(styles.container)}>
      <div className={clsx(styles.pageHolder)}>
        <QueueToggleGroup.Root
          type="single"
          value={`${settings.queuePage}`}
          onValueChange={(value): void => navigatePage(Number(value))}
        >
          <QueueScrollArea.Root>
            <QueueScrollArea.Viewport>
              <div className={clsx(styles.Pages)}>
                {queueDocument.pages.map((page, index, self) => (
                  <QueueContextMenu.Root key={index}>
                    <QueueContextMenu.Trigger
                      className={clsx(
                        'page-item',
                        dragOverIndex === index && styles.dragOver,
                      )}
                      draggable="true"
                      data-index={index}
                      onDragStart={(e): void => onDragStart(e, index)}
                      onDragEnter={(): void => setDragOverIndex(index)}
                      onDragEnd={(): void => setDragOverIndex(-1)}
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                      onDoubleClick={(): void => setEditNamePageIndex(index)}>
                      <QueueToggleGroup.Item
                        value={`${index}`}
                        size='small'>
                        {page.pageName}
                      </QueueToggleGroup.Item>
                    </QueueContextMenu.Trigger>
                    <QueueContextMenu.Portal>
                      <QueueContextMenu.Content>
                        <QueueContextMenu.Item onClick={(): void => movePage(index, Math.max(index - 1, 0))}>
                          페이지를 왼쪽으로 이동
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Item onClick={(): void => movePage(index, Math.min(index + 1, self.length - 1))}>
                          페이지를 오른쪽으로 이동
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Separator />
                        <QueueContextMenu.Item onClick={(): void => createPage(Math.max(index, 0))}>
                          왼쪽에 페이지 추가
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Item onClick={(): void => createPage(Math.min(index + 1, self.length))}>
                          오른쪽에 페이지 추가
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Separator />
                        <QueueContextMenu.Item onClick={(): void => onPageCopy(index)}>
                          페이지 복제
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Item onClick={(): void => setEditNamePageIndex(index)}>
                          페이지 이름 변경
                        </QueueContextMenu.Item>
                        {queueDocument!.pages.length >= 2 && (
                          <>
                            <QueueContextMenu.Separator />
                            <QueueContextMenu.Item
                              className={styles.Remove}
                              onClick={(): void => setDeleteConfirmPageIndex(index)}>
                              페이지 삭제
                            </QueueContextMenu.Item>
                          </>
                        )}
                      </QueueContextMenu.Content>
                    </QueueContextMenu.Portal>
                  </QueueContextMenu.Root>
                ))}
              </div>
            </QueueScrollArea.Viewport>
            <QueueScrollArea.Scrollbar orientation="horizontal" hidden>
              <QueueScrollArea.Thumb />
            </QueueScrollArea.Scrollbar>
          </QueueScrollArea.Root>
        </QueueToggleGroup.Root>
      </div>
      <div>
        <QueueIconButton
          onClick={(): void => createPage(queueDocument.pages.length)}>
          <SvgRemixIcon icon='ri-add-fill' />
        </QueueIconButton>
      </div>

      {/* 페이지 삭제 확인 다이얼로그 */}
      {deleteConfirmPageIndex !== -1 && (
        <QueueAlertDialog.Root
          open={deleteConfirmPageIndex !== -1}
          onOpenChange={(opened): void => !opened && setDeleteConfirmPageIndex(-1)}
        >
          <QueueAlertDialog.Overlay />
          <QueueAlertDialog.Content>
            <QueueAlertDialog.Title>
              페이지 삭제
            </QueueAlertDialog.Title>
            <QueueAlertDialog.Description>
              페이지를 삭제하시겠습니까?
            </QueueAlertDialog.Description>
            <QueueAlertDialog.Footer>
              <QueueAlertDialog.Cancel
                size='small'
                color='red'>
                취소
              </QueueAlertDialog.Cancel>
              <QueueAlertDialog.Action
                size='small'
                color='blue'
                onClick={(): void => onPageDeleteSubmit(deleteConfirmPageIndex)}
              >
                확인
              </QueueAlertDialog.Action>
            </QueueAlertDialog.Footer>
          </ QueueAlertDialog.Content>
        </QueueAlertDialog.Root>
      )}

      {/* 페이지 이름 수정 다이얼로그 */}
      {editNamePageIndex !== -1 && (
        <EditPageNameDialog
          open={editNamePageIndex !== -1}
          onOpenChange={(opened): void => !opened && setEditNamePageIndex(-1)}
          pageName={queueDocument.pages[editNamePageIndex].pageName}
          onSubmit={(value): void => onPageNameEdit(value, editNamePageIndex)} />
      )}
    </div>
  );
};