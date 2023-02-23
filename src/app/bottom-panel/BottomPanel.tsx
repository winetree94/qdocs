import clsx from 'clsx';
import { QueueIconButton } from 'components/button/Button';
import { useState } from 'react';
import { QueueContextMenu } from 'components/context-menu/Context';
import styles from './BottomPanel.module.scss';
import { QueueToggleGroup } from 'components/toggle-group/ToggleGroup';
import { EditPageNameDialog } from 'app/dialogs/EditPageNameDialog';
import { QueueAlertDialog } from 'components/alert-dialog/AlertDialog';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { useAppDispatch } from 'store/hooks';
import { documentSettingsSlice, QueueDocumentSettings } from 'store/settings/reducer';
import { generateUUID } from 'cdk/functions/uuid';
import { RootState } from 'store';
import { connect } from 'react-redux';
import { NormalizedQueueDocument } from 'store/document/reducer';
import { Dictionary, EntityId } from '@reduxjs/toolkit';
import { NormalizedQueueDocumentPage, pagesSlice } from 'store/page/reducer';
import { PageSelectors } from 'store/page/selectors';
import { DocumentSelectors } from 'store/document/selectors';
import { SettingSelectors } from 'store/settings/selectors';

export interface BaseBottomPanelProps {
  docs: NormalizedQueueDocument;
  docsPageIds: EntityId[];
  docsPages: Dictionary<NormalizedQueueDocumentPage>;
  settings: QueueDocumentSettings;
}

export const BaseBottomPanel = ({ docs, docsPages, docsPageIds, settings }: BaseBottomPanelProps) => {
  const dispatch = useAppDispatch();
  const [dragOverIndex, setDragOverIndex] = useState(-1);

  const [editNamePageIndex, setEditNamePageIndex] = useState<EntityId>('');
  const [deleteConfirmPageIndex, setDeleteConfirmPageIndex] = useState<EntityId>('');

  const setQueuePageIndex = (index: number): void => {
    dispatch(
      documentSettingsSlice.actions.setSettings({
        ...settings,
        queuePage: index,
        queueIndex: 0,
        queueStart: -1,
        queuePosition: 'pause',
        selectedObjectUUIDs: [],
        selectionMode: 'normal',
      }),
    );
  };

  const navigatePage = (index: number): void => {
    setQueuePageIndex(index);
  };

  const movePage = (from: EntityId, to: EntityId): void => {
    dispatch(
      pagesSlice.actions.switchPageIndex({
        from: from,
        to: to,
      }),
    );
    // setQueuePageIndex(to);
  };

  const createPage = (index: number): void => {
    const uuid = generateUUID();
    dispatch(
      pagesSlice.actions.addPage({
        documentId: docs.uuid,
        uuid: uuid,
        index,
        pageName: `Page-${Object.values(docsPages).length + 1}`,
      }),
    );
    setQueuePageIndex(index);
  };

  const removePage = (uuid: EntityId): void => {
    const index = docsPageIds.indexOf(uuid);
    dispatch(pagesSlice.actions.removePage(uuid));
    setQueuePageIndex(Math.min(index, docsPageIds.length - 1));
  };

  const onDragStart = (e: React.DragEvent<HTMLSpanElement>, uuid: EntityId): void => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${uuid}`);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>): boolean => {
    e.preventDefault();
    return false;
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    const from = e.dataTransfer.getData('text/plain') as string;
    if (!e.currentTarget || !e.currentTarget.classList.contains('page-item')) {
      return;
    }
    const to = e.currentTarget.getAttribute('data-uuid') as string;
    movePage(from, to);
  };

  const onPageNameEdit = (pageName: string, uuid: EntityId): void => {
    dispatch(
      pagesSlice.actions.updatePage({
        id: uuid,
        changes: {
          pageName: pageName.trim(),
        },
      }),
    );
    setEditNamePageIndex('');
  };

  const onPageCopy = (index: number): void => {
    const newId = generateUUID();
    dispatch(
      pagesSlice.actions.copyPage({
        fromId: docsPageIds[index],
        index: index,
        newId: newId,
      }),
    );
  };

  const onPageDeleteSubmit = (uuid: EntityId): void => {
    removePage(uuid);
    setDeleteConfirmPageIndex('');
  };

  return (
    <div className={clsx(styles.container)}>
      <div className={clsx(styles.pageHolder)}>
        <QueueToggleGroup.Root
          type="single"
          value={`${settings.queuePage}`}
          onValueChange={(value): void => navigatePage(Number(value))}>
          <QueueScrollArea.Root>
            <QueueScrollArea.Viewport>
              <div className={clsx(styles.Pages)}>
                {docsPageIds.map((uuid, index, self) => (
                  <QueueContextMenu.Root key={index}>
                    <QueueContextMenu.Trigger
                      className={clsx('page-item', dragOverIndex === index && styles.dragOver)}
                      draggable="true"
                      data-uuid={uuid}
                      onDragStart={(e): void => onDragStart(e, uuid)}
                      onDragEnter={(): void => setDragOverIndex(index)}
                      onDragEnd={(): void => setDragOverIndex(-1)}
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                      onDoubleClick={(): void => setEditNamePageIndex(uuid)}>
                      <QueueToggleGroup.Item value={`${index}`} size="small">
                        {docsPages[uuid]?.pageName}
                      </QueueToggleGroup.Item>
                    </QueueContextMenu.Trigger>
                    <QueueContextMenu.Portal>
                      <QueueContextMenu.Content>
                        <QueueContextMenu.Item onClick={(): void => movePage(uuid, self[Math.max(index - 1, 0)])}>
                          페이지를 왼쪽으로 이동
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Item
                          onClick={(): void => movePage(uuid, self[Math.min(index + 1, self.length - 1)])}>
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
                        <QueueContextMenu.Item onClick={(): void => setEditNamePageIndex(uuid)}>
                          페이지 이름 변경
                        </QueueContextMenu.Item>
                        {docsPageIds.length >= 2 && (
                          <>
                            <QueueContextMenu.Separator />
                            <QueueContextMenu.Item
                              className={styles.Remove}
                              onClick={(): void => setDeleteConfirmPageIndex(uuid)}>
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
        <QueueIconButton onClick={(): void => createPage(docsPageIds.length)}>
          <SvgRemixIcon icon="ri-add-fill" />
        </QueueIconButton>
      </div>

      {/* 페이지 삭제 확인 다이얼로그 */}
      {deleteConfirmPageIndex && (
        <QueueAlertDialog.Root
          open={!!deleteConfirmPageIndex}
          onOpenChange={(opened): void => !opened && setDeleteConfirmPageIndex('')}>
          <QueueAlertDialog.Overlay />
          <QueueAlertDialog.Content>
            <QueueAlertDialog.Title>페이지 삭제</QueueAlertDialog.Title>
            <QueueAlertDialog.Description>페이지를 삭제하시겠습니까?</QueueAlertDialog.Description>
            <QueueAlertDialog.Footer>
              <QueueAlertDialog.Cancel size="small" color="red">
                취소
              </QueueAlertDialog.Cancel>
              <QueueAlertDialog.Action
                size="small"
                color="blue"
                onClick={(): void => onPageDeleteSubmit(deleteConfirmPageIndex)}>
                확인
              </QueueAlertDialog.Action>
            </QueueAlertDialog.Footer>
          </QueueAlertDialog.Content>
        </QueueAlertDialog.Root>
      )}

      {/* 페이지 이름 수정 다이얼로그 */}
      {editNamePageIndex && (
        <EditPageNameDialog
          open={!!editNamePageIndex}
          onOpenChange={(opened): void => !opened && setEditNamePageIndex('')}
          pageName={docsPages[editNamePageIndex].pageName}
          onSubmit={(value): void => onPageNameEdit(value, editNamePageIndex)}
        />
      )}
    </div>
  );
};

const mapToStateProps = (state: RootState) => ({
  settings: SettingSelectors.settings(state),
  docs: DocumentSelectors.document(state),
  docsPageIds: PageSelectors.ids(state),
  docsPages: PageSelectors.entities(state),
});

export const BottomPanel = connect(mapToStateProps)(BaseBottomPanel);
