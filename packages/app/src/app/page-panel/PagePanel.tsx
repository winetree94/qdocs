import {
  BaseHTMLAttributes,
  Fragment,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { EntityId, nanoid } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { throttle } from 'lodash';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { SettingsActions, SettingSelectors } from '@legacy/store/settings';
import {
  NormalizedQueueDocumentPage,
  PageActions,
  PageSelectors,
} from '@legacy/store/page';
import { HistoryActions } from '@legacy/store/history';
import { DocumentSelectors } from '@legacy/store/document';
import { SvgRemixIcon } from '@legacy/cdk/icon/SvgRemixIcon';
import { QUEUE_UI_SIZE } from '@legacy/styles/ui/Size';
import { QUEUE_UI_COLOR } from '@legacy/styles/ui/Color';
import { useAlertDialog } from '@legacy/components/alert-dialog/AlertDialog';
import { QueueSeparator } from '@legacy/components/separator/Separator';
import { QueueScrollArea } from '@legacy/components/scroll-area/ScrollArea';
import { QueueButton } from '@legacy/components/buttons/button/Button';
import { QueueContextMenu } from '@legacy/components/context-menu/Context';
import { ObjectSelectors } from '@legacy/store/object';
import { EffectSelectors } from '@legacy/store/effect';
import { StandaloneRect } from '@legacy/components/queue/standaloneRects';
import { Scaler } from '@legacy/components/scaler/Scaler';
import { StandaloneText } from '@legacy/components/queue/standaloneRects/Text';
import { OBJECT_EFFECT_TYPE } from '@legacy/model/effect';
import { store } from 'store';

const PagePanelRoot = ({
  className,
  ...props
}: BaseHTMLAttributes<HTMLDivElement>) => {
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

const PagesBox = ({
  className,
  ...props
}: BaseHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx(
        'tw-p-3',
        'tw-flex',
        'tw-flex-col',
        'tw-gap-1',
        'tw-w-full',
        'tw-h-full',
        className,
      )}
      {...props}
    />
  );
};

const PageBox = ({
  className,
  ...props
}: BaseHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx(
        'tw-flex',
        'tw-justify-end',
        'tw-gap-1',
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
  page?: NormalizedQueueDocumentPage;
  pageId: EntityId;
}

const PagePreview = memo(
  ({ pageId, className, ...props }: PagePreviewProps) => {
    const queueDocument = useAppSelector(DocumentSelectors.document);
    const currentPageId = useAppSelector(SettingSelectors.pageId);

    // objects all 셀렉 시 전체 값을 바라보기 때문에, 다른 페이지의 오브젝트나
    // 첫번째 큐가 아닌 이펙트 변화시에도 렌더링이 발생하기 때문에 수정할 방법을 찾아야함
    const objects = useAppSelector((state) =>
      ObjectSelectors.allByPageId(state, pageId),
    );
    const firstQueueEffects = useAppSelector((state) =>
      EffectSelectors.firstQueueByPageId(state, pageId),
    );

    const firstQueueEffectObjectIds = useMemo(
      () => firstQueueEffects.map((effect) => effect.objectId),
      [firstQueueEffects],
    );
    const firstQueueObjects = useMemo(
      () =>
        objects.filter((object) =>
          firstQueueEffectObjectIds.includes(object.id),
        ),
      [objects, firstQueueEffectObjectIds],
    );

    const pagePreviewRef = useRef<HTMLDivElement>(null);

    const [pagePreviewScale, setPagePreviewScale] = useState(
      (pagePreviewRef.current?.offsetWidth || 1) /
        (queueDocument.documentRect.width || 1),
    );

    const throttled = useRef(
      throttle<ResizeObserverCallback>(() => {
        setPagePreviewScale(
          pagePreviewRef.current.offsetWidth / queueDocument.documentRect.width,
        );
      }, 33),
    );

    useEffect(() => {
      if (!pagePreviewRef.current) {
        return;
      }

      const resizeObserver = new ResizeObserver(throttled.current);
      resizeObserver.observe(pagePreviewRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    return (
      <div
        ref={pagePreviewRef}
        className={clsx(
          'tw-relative',
          'tw-w-full',
          'tw-h-auto',
          'tw-border',
          'tw-border-[var(--gray-8)]',
          'tw-rounded-[4px]',
          'tw-bg-[var(--gray-1)]',
          'tw-overflow-hidden',
          'tw-pointer-events-none',
          // document 비율의 설정대로 변경이 필요
          'tw-aspect-[16/9]',
          {
            'tw-border-[var(--violet-9)]': currentPageId === pageId,
          },
          className,
        )}
        {...props}>
        <Scaler
          className="tw-p-0"
          width={queueDocument.documentRect.width}
          height={queueDocument.documentRect.height}
          scale={pagePreviewScale}>
          {firstQueueObjects.map((firstQueueObject, index) => (
            <Fragment key={`preview-${firstQueueObject.id}-${index}`}>
              <StandaloneRect object={firstQueueObject} />
              <StandaloneText {...firstQueueObject} />
            </Fragment>
          ))}
        </Scaler>
      </div>
    );
  },
);

const PageAddBox = ({
  className,
  ...props
}: BaseHTMLAttributes<HTMLDivElement>) => {
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
  const currentPageId = useAppSelector(SettingSelectors.pageId);
  const { id: documentId } = useAppSelector(DocumentSelectors.document);

  const pageIds = useAppSelector(PageSelectors.ids);

  const [dragOverIndex, setDragOverIndex] = useState(-1);

  const setQueuePageIndex = (id: EntityId): void => {
    dispatch(
      SettingsActions.updateSettings({
        changes: {
          pageId: id,
          queueIndex: 0,
          queueStart: -1,
          queuePosition: 'pause',
          selectedObjectIds: [],
          selectionMode: 'normal',
        },
      }),
    );
  };

  const createPage = (index: number): void => {
    const newId = nanoid();

    dispatch(HistoryActions.Capture());
    dispatch(
      PageActions.addPage({
        documentId,
        id: newId,
        index,
        pageName: `Page-${pageIds.length + 1}`,
      }),
    );
    setQueuePageIndex(newId);
  };

  const removePage = (id: EntityId): void => {
    dispatch(HistoryActions.Capture());
    const index = pageIds.findIndex((pageId) => pageId === id);
    dispatch(PageActions.removePage(id));
    const sliced = pageIds.slice(0).filter((pageId) => pageId !== id);
    setQueuePageIndex(sliced[index] || sliced[sliced.length - 1]);
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

  const duplicatePageWithLastQueueSnapshot = (
    pageId: EntityId,
    index: number,
  ) => {
    const newId = nanoid();
    const effects = EffectSelectors.effectsByObjectId(store.getState());

    // 선택된 페이지의 objectIds
    const currentPageObjectIds = Object.values(
      store.getState().objects.entities,
    )
      .map((object) => object.pageId === pageId && object.id)
      .filter(Boolean);

    // effects를 순회하면서 OBJECT_EFFECT_TYPE.REMOVE가 없는 effects를 찾아 objectIds를 가져옴 (선택된 페이지의 objects)
    const queueObjectIdsWithoutRemoveEffect = Object.entries(effects).reduce<
      EntityId[]
    >((ids, [objectId, effectsValue]) => {
      if (
        effectsValue.every(
          (effect) =>
            effect.type !== OBJECT_EFFECT_TYPE.REMOVE &&
            currentPageObjectIds.includes(effect.objectId),
        )
      ) {
        ids.push(objectId);
      }

      return ids;
    }, []);

    dispatch(HistoryActions.Capture());
    dispatch(
      PageActions.duplicatePageWithQueueObjectIds({
        objectIds: queueObjectIdsWithoutRemoveEffect,
        index: index,
        fromId: pageId,
        newId,
      }),
    );
  };

  const duplicatePageAndContent = (pageId: EntityId, index: number): void => {
    const newId = nanoid();
    const currentPageObjectIds = Object.values(
      store.getState().objects.entities,
    )
      .map((object) => object.pageId === pageId && object.id)
      .filter(Boolean);

    dispatch(HistoryActions.Capture());
    dispatch(
      PageActions.duplicatePageWithQueueObjectIds({
        objectIds: currentPageObjectIds,
        index: index,
        fromId: pageId,
        withEffect: true,
        newId,
      }),
    );
  };

  const navigatePage = (id: EntityId): void => {
    setQueuePageIndex(id);
  };

  // drag
  const handleDragStart = (
    event: React.DragEvent<HTMLSpanElement>,
    id: EntityId,
  ): void => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', `${id}`);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): boolean => {
    event.preventDefault();

    return false;
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    const from = event.dataTransfer.getData('text/plain');
    const to = event.currentTarget.getAttribute('data-id');

    if (
      !event.currentTarget ||
      !event.currentTarget.classList.contains('page-item')
    ) {
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

  return (
    <PagePanelRoot>
      <QueueScrollArea.Root className="tw-h-full">
        <QueueScrollArea.Viewport>
          <PagesBox>
            {pageIds.map((pageId, index, self) => (
              <QueueContextMenu.Root key={pageId}>
                <QueueContextMenu.Trigger asChild>
                  <PageBox
                    draggable
                    className={clsx('page-item', {
                      'tw-bg-[var(--gray-5)]': currentPageId === pageId,
                      'tw-opacity-50': dragOverIndex === index,
                    })}
                    data-id={pageId}
                    onClick={() => navigatePage(pageId)}
                    onDragStart={(event): void =>
                      handleDragStart(event, pageId)
                    }
                    onDragEnter={(): void => setDragOverIndex(index)}
                    onDragEnd={(): void => setDragOverIndex(-1)}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}>
                    <div className="tw-shrink-0 tw-flex tw-flex-col tw-justify-between tw-items-end">
                      <div className="tw-font-normal tw-text-xs tw-cursor-default">
                        {index + 1}
                      </div>
                      <div className="tw-flex">
                        <button
                          className="tw-text-[var(--gray-10)] tw-cursor-pointer"
                          onClick={() =>
                            duplicatePageWithLastQueueSnapshot(pageId, index)
                          }>
                          <SvgRemixIcon
                            icon="ri-file-copy-line"
                            size={QUEUE_UI_SIZE.MEDIUM}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="tw-flex-1 tw-max-w-[80%]">
                      <PagePreview pageId={pageId} />
                    </div>
                  </PageBox>
                </QueueContextMenu.Trigger>

                <QueueContextMenu.Portal>
                  <QueueContextMenu.Content>
                    <QueueContextMenu.Item
                      onClick={() =>
                        movePage(pageId, self[Math.max(index - 1, 0)])
                      }>
                      {t('page-panel.move-page-to-before')}
                    </QueueContextMenu.Item>
                    <QueueContextMenu.Item
                      onClick={() =>
                        movePage(
                          pageId,
                          self[Math.min(index + 1, self.length - 1)],
                        )
                      }>
                      {t('page-panel.move-page-to-after')}
                    </QueueContextMenu.Item>
                    <QueueContextMenu.Separator />
                    <QueueContextMenu.Item
                      onClick={() => createPage(Math.max(index - 1))}>
                      {t('page-panel.add-page-to-before')}
                    </QueueContextMenu.Item>
                    <QueueContextMenu.Item
                      onClick={() => createPage(Math.min(index, self.length))}>
                      {t('page-panel.add-page-to-after')}
                    </QueueContextMenu.Item>
                    <QueueContextMenu.Separator />
                    <QueueContextMenu.Item
                      onClick={() => duplicatePageAndContent(pageId, index)}>
                      {t('page-panel.duplicate-page-and-content')}
                    </QueueContextMenu.Item>
                    {pageIds.length >= 2 && (
                      <>
                        <QueueContextMenu.Separator />
                        <QueueContextMenu.Item
                          className="tw-text-[var(--red-10)]"
                          onClick={() => openDeleteConfirmDialog(pageId)}>
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
          onClick={() => createPage(pageIds.length)}>
          <SvgRemixIcon icon="ri-add-box-line" size={QUEUE_UI_SIZE.MEDIUM} />
          <span className="tw-ml-1">{t('page-panel.add-page')}</span>
        </QueueButton>
      </PageAddBox>
    </PagePanelRoot>
  );
};
