import clsx from 'clsx';
import { QueueIconButton } from 'components/button/Button';
import { useState } from 'react';
import { QueueContextMenu } from 'components/context-menu/Context';
import styles from './BottomPanel.module.scss';
import { QueueToggleGroup } from 'components/toggle-group/ToggleGroup';
import { EditPageNameDialog } from 'app/dialogs/EditPageNameDialog';
import { useAlertDialog } from 'components/alert-dialog/AlertDialog';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { EntityId, nanoid } from '@reduxjs/toolkit';
import { PageSelectors } from 'store/page/selectors';
import { DocumentSelectors } from 'store/document/selectors';
import { PageActions } from '../../store/page';
import { SettingsActions, SettingSelectors } from '../../store/settings';
import { HistoryActions } from 'store/history';
import { useTranslation } from 'react-i18next';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import { Timeline } from 'components/timeline/Timeline';
import { useRootRenderer } from 'cdk/root-renderer/root-renderer';

export const BottomPanel = () => {
  const { t } = useTranslation();
  const rootRenderer = useRootRenderer();
  const alertDialog = useAlertDialog();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);
  const document = useAppSelector(DocumentSelectors.document);
  const pages = useAppSelector(PageSelectors.all);
  const [dragOverIndex, setDragOverIndex] = useState(-1);

  const openEditPageNameDialog = (pageId: EntityId) => {
    const page = pages.find((page) => page.id === pageId);
    rootRenderer.render(
      <EditPageNameDialog
        pageName={page.pageName}
        onSubmit={(value): void => onPageNameEdit(value, pageId)}
      />
    );
  };

  const setQueuePageIndex = (id: EntityId): void => {
    dispatch(
      SettingsActions.setSettings({
        ...settings,
        pageId: id,
        queueIndex: 0,
        queueStart: -1,
        queuePosition: 'pause',
        selectedObjectIds: [],
        selectionMode: 'normal',
      }),
    );
  };

  const navigatePage = (id: string): void => {
    setQueuePageIndex(id);
  };

  const movePage = (from: EntityId, to: EntityId): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      PageActions.switchPageIndex({
        from: from,
        to: to,
      }),
    );
  };

  const createPage = (index: number): void => {
    dispatch(HistoryActions.Capture());
    const newId = nanoid();
    dispatch(
      PageActions.addPage({
        documentId: document.id,
        id: newId,
        index,
        pageName: `Page-${pages.length + 1}`,
      }),
    );
    setQueuePageIndex(newId);
  };

  const removePage = (id: EntityId): void => {
    dispatch(HistoryActions.Capture());
    const index = pages.findIndex((page) => page.id === id);
    dispatch(PageActions.removePage(id));
    const sliced = pages.slice(0).filter((page) => page.id !== id);
    setQueuePageIndex(sliced[index]?.id || sliced[sliced.length - 1]?.id);
  };

  const onDragStart = (e: React.DragEvent<HTMLSpanElement>, id: EntityId): void => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${id}`);
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
    const to = e.currentTarget.getAttribute('data-id') as string;
    movePage(from, to);
  };

  const onPageNameEdit = (pageName: string, id: EntityId): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      PageActions.updatePage({
        id: id,
        changes: {
          pageName: pageName.trim(),
        },
      }),
    );
  };

  const onPageCopy = (index: number): void => {
    dispatch(HistoryActions.Capture());
    const newId = nanoid();
    dispatch(
      PageActions.copyPage({
        fromId: pages[index].id,
        index: index,
        newId: newId,
      }),
    );
  };

  const openDeleteConfirmDialog = (id: EntityId): void => {
    alertDialog.open({
      title: '페이지 삭제',
      description: '페이지를 삭제하시겠습니까?',
      buttons: [
        {
          label: '취소',
          size: QUEUE_UI_SIZE.MEDIUM,
          color: QUEUE_UI_COLOR.RED,
        },
        {
          label: '삭제',
          onClick: (): void => removePage(id),
        },
      ],
    });
  };

  return (
    <div className="tw-rounded-t-lg tw-bg-white tw-h-full">
      <Timeline></Timeline>
      <div className={clsx(styles.container)}>
        <div className={clsx(styles.pageHolder)}>
          <QueueToggleGroup.Root
            type="single"
            value={`${settings.pageId}`}
            onValueChange={(value): void => navigatePage(value)}>
            <QueueScrollArea.Root>
              <QueueScrollArea.Viewport>
                <div className={clsx(styles.Pages)}>
                  {pages.map((page, index, self) => (
                    <QueueContextMenu.Root key={index}>
                      <QueueContextMenu.Trigger
                        className={clsx('page-item', dragOverIndex === index && styles.dragOver)}
                        draggable="true"
                        data-id={page.id}
                        onDragStart={(e): void => onDragStart(e, page.id)}
                        onDragEnter={(): void => setDragOverIndex(index)}
                        onDragEnd={(): void => setDragOverIndex(-1)}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        onDoubleClick={(): void => openEditPageNameDialog(page.id)}>
                        <QueueToggleGroup.Item value={`${page.id}`} size={QUEUE_UI_SIZE.MEDIUM}>
                          {page.pageName}
                        </QueueToggleGroup.Item>
                      </QueueContextMenu.Trigger>
                      <QueueContextMenu.Portal>
                        <QueueContextMenu.Content>
                          <QueueContextMenu.Item
                            onClick={(): void => movePage(page.id, self[Math.max(index - 1, 0)].id)}>
                            {t('bottom-panel.move-page-to-left')}
                          </QueueContextMenu.Item>
                          <QueueContextMenu.Item
                            onClick={(): void => movePage(page.id, self[Math.min(index + 1, self.length - 1)].id)}>
                            {t('bottom-panel.move-page-to-right')}
                          </QueueContextMenu.Item>
                          <QueueContextMenu.Separator />
                          <QueueContextMenu.Item onClick={(): void => createPage(Math.max(index - 1))}>
                            {t('bottom-panel.add-page-to-left')}
                          </QueueContextMenu.Item>
                          <QueueContextMenu.Item onClick={(): void => createPage(Math.min(index, self.length))}>
                            {t('bottom-panel.add-page-to-right')}
                          </QueueContextMenu.Item>
                          <QueueContextMenu.Separator />
                          <QueueContextMenu.Item onClick={(): void => onPageCopy(index)}>
                            {t('global.duplicate')}
                          </QueueContextMenu.Item>
                          <QueueContextMenu.Item onClick={(): void => openEditPageNameDialog(page.id)}>
                            {t('global.rename')}
                          </QueueContextMenu.Item>
                          {pages.length >= 2 && (
                            <>
                              <QueueContextMenu.Separator />
                              <QueueContextMenu.Item
                                className={styles.Remove}
                                onClick={(): void => openDeleteConfirmDialog(page.id)}>
                                {t('global.delete')}
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
          <QueueIconButton onClick={(): void => createPage(pages.length)}>
            <SvgRemixIcon icon="ri-add-fill" />
          </QueueIconButton>
        </div>
      </div>
    </div>
  );
};
