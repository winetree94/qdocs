import { fitScreenSizeEvent } from '@legacy/app/events/event';
import { useEventDispatch } from '@legacy/cdk/hooks/event-dispatcher';
import clsx from 'clsx';
import { QueueScrollArea } from '@legacy/components/scroll-area/ScrollArea';
import { QueueSeparator } from '@legacy/components/separator/Separator';
import { QueueIconButton } from '@legacy/components/buttons/button/Button';
import styles from './SubHeader.module.scss';
import { SettingSelectors } from '@legacy/store/settings/selectors';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { SettingsActions } from '@legacy/store/settings/actions';
import { HistoryActions } from '@legacy/store/history';
import { HistorySelectors } from '@legacy/store/history/selectors';
import { QUEUE_UI_SIZE } from '@legacy/styles/ui/Size';
import { ReactComponent as CopyIcon } from '@legacy/assets/icons/copy.svg';
import { ReactComponent as CornerUpLeftIcon } from '@legacy/assets/icons/corner-up-left.svg';
import { ReactComponent as CornerUpRightIcon } from '@legacy/assets/icons/corner-up-right.svg';
import { ReactComponent as ImageIcon } from '@legacy/assets/icons/image.svg';
import { ReactComponent as PrinterIcon } from '@legacy/assets/icons/printer.svg';
import { ReactComponent as SaveIcon } from '@legacy/assets/icons/save.svg';
import { ReactComponent as SearchIcon } from '@legacy/assets/icons/search.svg';
import { ReactComponent as ShareIcon } from '@legacy/assets/icons/share-2.svg';
import { ReactComponent as SidebarIcon } from '@legacy/assets/icons/sidebar.svg';
import { ReactComponent as TableIcon } from '@legacy/assets/icons/table.svg';
import { ReactComponent as TypeIcon } from '@legacy/assets/icons/type.svg';
import { memo, useState } from 'react';
import { QueueDropdown } from '@legacy/components/dropdown';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import {
  useCreateFigure,
  useCreateImage,
} from '@legacy/cdk/hooks/useCreateFigure';
import QueueRectAddLayer from '@legacy/app/sub-header/RectAddLayer/RectAddLayer';
import QueueLineAddLayer from '@legacy/app/sub-header/LineAddLayer/LineAddLayer';
import IconAddLayer from './IconAddLayer/IconAddLayer';
import { store } from 'store';
import { DocumentSelectors } from '@legacy/store/document';
import {
  createDefaultImage,
  createDefaultSquareText,
} from '@legacy/model/object';
import {
  ImageEncodingMessage,
  IMAGE_ENCODING_STATUS,
} from '@legacy/workers/imageConversionWorker';
import { nanoid } from '@reduxjs/toolkit';

const QueueSubHeader = memo(() => {
  const dispatch = useAppDispatch();
  const eventDispatch = useEventDispatch();
  const { t } = useTranslation();

  const history = useAppSelector(HistorySelectors.all);
  const currentQueueIndex = useAppSelector(SettingSelectors.queueIndex);
  const currentPageId = useAppSelector(SettingSelectors.pageId);
  const scale = Math.floor(useAppSelector(SettingSelectors.scale) * 100);

  const leftPanelOpened = useAppSelector(SettingSelectors.leftPanelOpened);
  const bottomPanelOpened = useAppSelector(SettingSelectors.bottomPanelOpened);

  const [isDropdownOpen, setIsDropdownOpen] = useState({
    sidebar: false,
    text: false,
    image: false,
    rect: false,
    share: false,
  });

  const createImage = useCreateImage(
    currentPageId,
    currentQueueIndex,
    dispatch,
  );

  const handleCreateImageClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = false;

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      const worker = new Worker(
        /* webpackChunkName: "image-encoding-worker" */ new URL(
          '../../workers/imageConversionWorker.ts',
          import.meta.url,
        ),
      );

      worker.addEventListener(
        'message',
        (event: MessageEvent<ImageEncodingMessage>) => {
          const { status, imageData } = event.data;

          switch (status) {
            case IMAGE_ENCODING_STATUS.ENCODED:
              createImage(createDefaultImage)({
                assetId: nanoid(),
                alt: imageData.fileName,
                src: imageData.src,
              });

              break;
            case IMAGE_ENCODING_STATUS.ERROR:
              // what to do?
              break;
          }
        },
      );

      worker.postMessage(file);
    });

    fileInput.click();
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

  const createFigure = useCreateFigure(
    currentPageId,
    currentQueueIndex,
    dispatch,
  );
  const createText = createFigure(createDefaultSquareText);

  return (
    <QueueScrollArea.Root className={styles.Container}>
      <QueueScrollArea.Viewport>
        <div className={styles.ItemRoot}>
          <div className={styles.ItemGroup}>
            <div className={styles.ItemGroup}>
              <QueueDropdown
                open={isDropdownOpen.sidebar}
                onOpenChange={() =>
                  setIsDropdownOpen({
                    ...isDropdownOpen,
                    sidebar: !isDropdownOpen.sidebar,
                  })
                }>
                <QueueDropdown.Trigger>
                  <div className="tw-flex tw-items-center tw-p-3 tw-gap-1">
                    <SidebarIcon />
                    <ChevronDownIcon
                      className={clsx(
                        'tw-w-3',
                        'tw-h-3',
                        'tw-transition-all',
                        'tw-duration-300',
                        {
                          'tw-scale-y-[1]': !isDropdownOpen.sidebar,
                          'tw-scale-y-[-1]': isDropdownOpen.sidebar,
                        },
                      )}
                    />
                  </div>
                </QueueDropdown.Trigger>

                <QueueDropdown.Content>
                  <QueueDropdown.Item
                    onClick={() =>
                      dispatch(
                        SettingsActions.updateSettings({
                          changes: {
                            leftPanelOpened: !leftPanelOpened,
                          },
                        }),
                      )
                    }>
                    {leftPanelOpened
                      ? t('menu.close-left-sidebar')
                      : t('menu.open-left-sidebar')}
                  </QueueDropdown.Item>
                  <QueueDropdown.Item
                    onClick={() =>
                      dispatch(
                        SettingsActions.updateSettings({
                          changes: {
                            bottomPanelOpened: !bottomPanelOpened,
                          },
                        }),
                      )
                    }>
                    {bottomPanelOpened
                      ? t('menu.close-bottom-sidebar')
                      : t('menu.open-bottom-sidebar')}
                  </QueueDropdown.Item>
                </QueueDropdown.Content>
              </QueueDropdown>

              <QueueSeparator.Root
                orientation="vertical"
                decorative
                className={styles.Separator}
              />
            </div>

            <div className={styles.ItemGroup}>
              {/* undo */}
              <QueueIconButton
                size={QUEUE_UI_SIZE.MEDIUM}
                onClick={() => dispatch(HistoryActions.Undo())}
                disabled={!history.previous.length}>
                <CornerUpLeftIcon />
              </QueueIconButton>

              {/* redo */}
              <QueueIconButton
                size={QUEUE_UI_SIZE.MEDIUM}
                onClick={() => dispatch(HistoryActions.Redo())}
                disabled={!history.future.length}>
                <CornerUpRightIcon />
              </QueueIconButton>

              <QueueSeparator.Root
                orientation="vertical"
                decorative
                className={styles.Separator}
              />
            </div>

            <div className={styles.ItemGroup}>
              <QueueIconButton
                size={QUEUE_UI_SIZE.MEDIUM}
                onClick={() => createText()}>
                <TypeIcon />
              </QueueIconButton>

              <QueueIconButton
                size={QUEUE_UI_SIZE.MEDIUM}
                onClick={() => handleCreateImageClick()}>
                <ImageIcon />
              </QueueIconButton>

              <QueueDropdown
                open={isDropdownOpen.rect}
                onOpenChange={() =>
                  setIsDropdownOpen({
                    ...isDropdownOpen,
                    rect: !isDropdownOpen.rect,
                  })
                }>
                <QueueDropdown.Trigger>
                  <div className="tw-flex tw-items-center tw-p-3 tw-gap-1">
                    <CopyIcon />
                    <ChevronDownIcon
                      className={clsx(
                        'tw-w-3',
                        'tw-h-3',
                        'tw-transition-all',
                        'tw-duration-300',
                        {
                          'tw-scale-y-[1]': !isDropdownOpen.rect,
                          'tw-scale-y-[-1]': isDropdownOpen.rect,
                        },
                      )}
                    />
                  </div>
                </QueueDropdown.Trigger>

                <QueueDropdown.Content>
                  <QueueDropdown.Sub>
                    <QueueDropdown.SubTrigger className="tw-py-2 tw-px-6">
                      {t('global.shape')}
                    </QueueDropdown.SubTrigger>
                    <QueueDropdown.SubContent>
                      <QueueScrollArea.Root className="">
                        <QueueScrollArea.Viewport className=""></QueueScrollArea.Viewport>
                        <QueueRectAddLayer />
                        <QueueScrollArea.Scrollbar orientation="vertical">
                          <QueueScrollArea.Thumb />
                        </QueueScrollArea.Scrollbar>
                        <QueueScrollArea.Scrollbar orientation="horizontal">
                          <QueueScrollArea.Thumb />
                        </QueueScrollArea.Scrollbar>
                        <QueueScrollArea.Corner />
                      </QueueScrollArea.Root>
                    </QueueDropdown.SubContent>
                  </QueueDropdown.Sub>

                  <QueueDropdown.Sub>
                    <QueueDropdown.SubTrigger className="tw-py-2 tw-px-6">
                      {t('global.line')}
                    </QueueDropdown.SubTrigger>
                    <QueueDropdown.SubContent>
                      <QueueScrollArea.Root className="">
                        <QueueScrollArea.Viewport className=""></QueueScrollArea.Viewport>
                        <QueueLineAddLayer />
                        <QueueScrollArea.Scrollbar orientation="vertical">
                          <QueueScrollArea.Thumb />
                        </QueueScrollArea.Scrollbar>
                        <QueueScrollArea.Scrollbar orientation="horizontal">
                          <QueueScrollArea.Thumb />
                        </QueueScrollArea.Scrollbar>
                        <QueueScrollArea.Corner />
                      </QueueScrollArea.Root>
                    </QueueDropdown.SubContent>
                  </QueueDropdown.Sub>

                  <QueueDropdown.Sub>
                    <QueueDropdown.SubTrigger className="tw-py-2 tw-px-6">
                      {t('global.icon')}
                    </QueueDropdown.SubTrigger>
                    <QueueDropdown.SubContent>
                      <IconAddLayer />
                    </QueueDropdown.SubContent>
                  </QueueDropdown.Sub>
                </QueueDropdown.Content>
              </QueueDropdown>

              <QueueIconButton size={QUEUE_UI_SIZE.MEDIUM} disabled={true}>
                <ShareIcon />
              </QueueIconButton>

              <QueueIconButton size={QUEUE_UI_SIZE.MEDIUM} disabled={true}>
                <TableIcon />
              </QueueIconButton>
            </div>
          </div>

          <div className={clsx(styles.ItemGroup, 'tw-gap-2')}>
            <QueueIconButton
              className="tw-px-2"
              size={QUEUE_UI_SIZE.MEDIUM}
              onClick={() => {
                eventDispatch(fitScreenSizeEvent());
              }}
              style={{ width: 'unset' }}>
              <SearchIcon />
              <span
                className={clsx('tw-text-black-900', 'tw-text-14', 'tw-mx-1')}>
                {scale}%
              </span>
            </QueueIconButton>

            <QueueIconButton size={QUEUE_UI_SIZE.MEDIUM} disabled={true}>
              <PrinterIcon />
            </QueueIconButton>

            <QueueIconButton
              size={QUEUE_UI_SIZE.MEDIUM}
              onClick={onSaveDocumentClick}>
              <SaveIcon />
            </QueueIconButton>

            {/* <QueueIconButton
              size={QUEUE_UI_SIZE.MEDIUM}
              onClick={() => eventDispatch(fitScreenSizeEvent())}>
              <SvgRemixIcon icon={'ri-fullscreen-fill'} />
            </QueueIconButton> */}
            {/* <QueueIconButton
              size={QUEUE_UI_SIZE.MEDIUM}
              onClick={() => dispatch(SettingsActions.decreaseScale())}>
              <SvgRemixIcon icon={'ri-subtract-line'} />
            </QueueIconButton>
            <QueueIconButton
              size={QUEUE_UI_SIZE.MEDIUM}
              onClick={() => dispatch(SettingsActions.increaseScale())}>
              <SvgRemixIcon icon={'ri-add-line'} />
            </QueueIconButton> */}
          </div>
        </div>
      </QueueScrollArea.Viewport>
      <QueueScrollArea.Scrollbar orientation="horizontal" hidden>
        <QueueScrollArea.Thumb />
      </QueueScrollArea.Scrollbar>
    </QueueScrollArea.Root>
  );
});

export default QueueSubHeader;
