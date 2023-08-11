import { BaseHTMLAttributes, useState } from 'react';
import { EntityId, nanoid } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingsActions, SettingSelectors } from 'store/settings';
import { NormalizedQueueDocumentPage, PageActions, PageSelectors } from 'store/page';
import { HistoryActions } from 'store/history';
import { DocumentSelectors } from 'store/document';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import { useAlertDialog } from 'components/alert-dialog/AlertDialog';
import { QueueSeparator } from 'components/separator/Separator';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { QueueButton } from 'components/buttons/button/Button';
import { QueueContextMenu } from 'components/context-menu/Context';
import { ObjectSelectors } from 'store/object';
import { EffectSelectors } from 'store/effect';
import { StandaloneRect } from 'components/queue/standaloneRects';

const PagePanelRoot = ({ className, ...props }: BaseHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx(
        'tw-relative',
        'tw-w-full',
        'tw-h-full',
        'tw-pb-[69px]',
        'tw-border-y',
        'tw-border-r',
        'tw-rounded-r-[20px]',
        'tw-border-[var(--gray-5)]',
        'tw-bg-[var(--gray-1)]',
        className,
      )}
      {...props}
    />
  );
};

const PagesBox = ({ className, ...props }: BaseHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx('tw-p-3', 'tw-flex', 'tw-flex-col', 'tw-gap-1', 'tw-w-full', 'tw-h-full', className)}
      {...props}
    />
  );
};

const PageBox = ({ className, ...props }: BaseHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx(
        'tw-flex',
        'tw-justify-end',
        'tw-gap-1',
        'tw-h-[90px]',
        'tw-p-2',
        'tw-rounded-lg',
        'hover:tw-bg-[var(--gray-5)]',
        'hover:tw-cursor-grab',
        'active:tw-cursor-grabbing',
        className,
      )}
      {...props}
    />
  );
};

export interface PagePreviewProps extends BaseHTMLAttributes<HTMLDivElement> {
  page: NormalizedQueueDocumentPage;
}

const PagePreview = ({ page, className, ...props }: PagePreviewProps) => {
  const objects = useAppSelector((state) => ObjectSelectors.allByPageId(state, page.id));
  const effects = useAppSelector((state) => EffectSelectors.allByPageId(state, page.id));

  const firstQueueEffects = effects.filter((effect) => effect.index === 0);
  const firstQueueEffectObjectIds = firstQueueEffects.map((effect) => effect.objectId);

  const firstQueueObjects = objects.filter((object) => firstQueueEffectObjectIds.includes(object.id));

  return (
    <div
      className={clsx(
        'tw-w-full',
        'tw-h-full',
        'tw-border',
        'tw-border-[var(--blue-10)]',
        'tw-rounded-[4px]',
        'tw-bg-[var(--gray-1)]',
        'tw-overflow-hidden',
        className,
      )}
      {...props}>
      {firstQueueObjects.map((firstQueueObject) => (
        <StandaloneRect
          type="rect"
          objectId={firstQueueObject.id}
          width={firstQueueObject.rect.width}
          height={firstQueueObject.rect.height}
          position={{
            x: firstQueueObject.rect.x,
            y: firstQueueObject.rect.y,
          }}
          stroke={firstQueueObject.stroke}
          rotate={firstQueueObject.rotate}
          fade={firstQueueObject.fade}
          scale={firstQueueObject.scale}
          fill={firstQueueObject.fill}
        />
      ))}
    </div>
  );
};

const PageAddBox = ({ className, ...props }: BaseHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx(
        'tw-absolute',
        'tw-bottom-0',
        'tw-left-0',
        'tw-w-full',
        'tw-p-3',
        'tw-bg-[var(--gray-1)]',
        className,
      )}
      {...props}
    />
  );
};

export const PagePanel = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const alertDialog = useAlertDialog();
  const settings = useAppSelector(SettingSelectors.settings);
  const document = useAppSelector(DocumentSelectors.document);
  const pages = useAppSelector(PageSelectors.all);

  const [dragOverIndex, setDragOverIndex] = useState(-1);

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

  const createPage = (index: number): void => {
    const newId = nanoid();

    dispatch(HistoryActions.Capture());
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

  const movePage = (from: EntityId, to: EntityId): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      PageActions.switchPageIndex({
        from,
        to,
      }),
    );
  };

  const copyPage = (index: number): void => {
    const newId = nanoid();

    dispatch(HistoryActions.Capture());
    dispatch(
      PageActions.copyPage({
        fromId: pages[index].id,
        index: index,
        newId: newId,
      }),
    );
  };

  const navigatePage = (id: EntityId): void => {
    setQueuePageIndex(id);
  };

  // drag
  const handleDragStart = (event: React.DragEvent<HTMLSpanElement>, id: EntityId): void => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', `${id}`);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): boolean => {
    event.preventDefault();

    return false;
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    const from = event.dataTransfer.getData('text/plain') as string;
    const to = event.currentTarget.getAttribute('data-id') as string;

    if (!event.currentTarget || !event.currentTarget.classList.contains('page-item')) {
      return;
    }

    if (from === to) {
      return;
    }

    movePage(from, to);
  };

  // context menu
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

  // page name 표기하는 부분이 없기 때문에 일단 주석
  // const editPageName = (pageName: string, id: EntityId): void => {
  //   dispatch(HistoryActions.Capture());
  //   dispatch(
  //     PageActions.updatePage({
  //       id: id,
  //       changes: {
  //         pageName: pageName.trim(),
  //       },
  //     }),
  //   );
  // };

  return (
    <PagePanelRoot>
      <QueueScrollArea.Root className="tw-h-full">
        <QueueScrollArea.Viewport>
          <PagesBox>
            {pages.map((page, index, self) => (
              <QueueContextMenu.Root key={page.id}>
                <QueueContextMenu.Trigger asChild>
                  <PageBox
                    draggable
                    className={clsx('page-item', {
                      'tw-bg-[var(--gray-5)]': settings.pageId === page.id,
                      'tw-opacity-50': dragOverIndex === page.index,
                    })}
                    data-id={page.id}
                    onClick={() => navigatePage(page.id)}
                    onDragStart={(event): void => handleDragStart(event, page.id)}
                    onDragEnter={(): void => setDragOverIndex(index)}
                    onDragEnd={(): void => setDragOverIndex(-1)}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}>
                    <div className="tw-shrink-0 tw-flex tw-flex-col tw-justify-between tw-items-end">
                      <div className="tw-text-xs tw-cursor-default">{page.index + 1}</div>
                      <div className="tw-flex">
                        <button className="tw-text-[var(--gray-10)] tw-cursor-pointer" onClick={() => copyPage(index)}>
                          <SvgRemixIcon icon="ri-file-copy-line" size={QUEUE_UI_SIZE.MEDIUM} />
                        </button>
                      </div>
                    </div>

                    <div className="tw-flex-1 tw-max-w-[80%]">
                      <PagePreview page={page} />
                    </div>
                  </PageBox>
                </QueueContextMenu.Trigger>

                <QueueContextMenu.Portal>
                  <QueueContextMenu.Content>
                    <QueueContextMenu.Item onClick={() => movePage(page.id, self[Math.max(index - 1, 0)].id)}>
                      {t('page-panel.move-page-to-before')}
                    </QueueContextMenu.Item>
                    <QueueContextMenu.Item
                      onClick={() => movePage(page.id, self[Math.min(index + 1, self.length - 1)].id)}>
                      {t('page-panel.move-page-to-after')}
                    </QueueContextMenu.Item>
                    <QueueContextMenu.Separator />
                    <QueueContextMenu.Item onClick={() => createPage(Math.max(index - 1))}>
                      {t('page-panel.add-page-to-before')}
                    </QueueContextMenu.Item>
                    <QueueContextMenu.Item onClick={() => createPage(Math.min(index, self.length))}>
                      {t('bottom-panel.add-page-to-after')}
                    </QueueContextMenu.Item>
                    <QueueContextMenu.Separator />
                    <QueueContextMenu.Item onClick={() => copyPage(index)}>
                      {t('global.duplicate')}
                    </QueueContextMenu.Item>
                    {pages.length >= 2 && (
                      <>
                        <QueueContextMenu.Separator />
                        <QueueContextMenu.Item
                          className="tw-text-[var(--red-10)]"
                          onClick={() => openDeleteConfirmDialog(page.id)}>
                          {t('global.delete')}
                        </QueueContextMenu.Item>
                      </>
                    )}
                  </QueueContextMenu.Content>
                </QueueContextMenu.Portal>
              </QueueContextMenu.Root>
            ))}
          </PagesBox>
        </QueueScrollArea.Viewport>
        <QueueScrollArea.Scrollbar>
          <QueueScrollArea.Thumb />
        </QueueScrollArea.Scrollbar>
      </QueueScrollArea.Root>
      <PageAddBox>
        <QueueSeparator.Root className="tw-mb-3" />
        <QueueButton
          className="tw-w-full tw-box-border tw-text-sm"
          size={QUEUE_UI_SIZE.MEDIUM}
          color={QUEUE_UI_COLOR.DEFAULT}
          onClick={() => createPage(pages.length)}>
          <SvgRemixIcon icon="ri-add-box-line" size={QUEUE_UI_SIZE.MEDIUM} />
          <span className="tw-ml-1">{t('page-panel.add-slide')}</span>
        </QueueButton>
      </PageAddBox>
    </PagePanelRoot>
  );
};
