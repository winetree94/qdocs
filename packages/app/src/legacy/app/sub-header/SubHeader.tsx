import { fitScreenSizeEvent } from '@legacy/app/events/event';
import { useEventDispatch } from '@legacy/cdk/hooks/event-dispatcher';
import { SettingSelectors } from '@legacy/store/settings/selectors';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { SettingsActions } from '@legacy/store/settings/actions';
import { HistoryActions } from '@legacy/store/history';
import { HistorySelectors } from '@legacy/store/history/selectors';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCreateFigure,
  useCreateImage,
} from '@legacy/cdk/hooks/useCreateFigure';
import QueueRectAddLayer from '@legacy/app/sub-header/RectAddLayer/RectAddLayer';
import QueueLineAddLayer from '@legacy/app/sub-header/LineAddLayer/LineAddLayer';
import IconAddLayer from './IconAddLayer/IconAddLayer';
import { store } from '@legacy/store';
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
import {
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiImageLine,
  RiPrinterLine,
  RiSaveLine,
  RiShapesLine,
  RiSidebarUnfoldLine,
  RiText,
  RiZoomInLine,
} from '@remixicon/react';
import { Button, DropdownMenu, Flex, IconButton, ScrollArea } from '@radix-ui/themes';

const QueueSubHeader = memo(function QueueSubHeader() {
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
    <ScrollArea scrollbars='horizontal' className='tw-h-fit tw-p-2'>
      <Flex>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant='soft'>
              <RiSidebarUnfoldLine />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
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
            </DropdownMenu.Item>
            <DropdownMenu.Item
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
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <IconButton variant='soft'
          onClick={() => dispatch(HistoryActions.Undo())}
          disabled={!history.previous.length}>
          <RiArrowGoBackLine />
        </IconButton>

        <IconButton variant='soft'
          onClick={() => dispatch(HistoryActions.Redo())}
          disabled={!history.future.length}>
          <RiArrowGoForwardLine />
        </IconButton>

        <IconButton variant='soft' onClick={() => createText()}>
          <RiText />
        </IconButton>

        <IconButton
          variant='soft'
          onClick={() => handleCreateImageClick()}>
          <RiImageLine />
        </IconButton>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant='soft'>
              <RiShapesLine />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="tw-py-2 tw-px-6">
                {t('global.shape')}
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <ScrollArea>
                  <QueueRectAddLayer />
                </ScrollArea>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="tw-py-2 tw-px-6">
                {t('global.line')}
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <ScrollArea>
                  <QueueLineAddLayer />
                </ScrollArea>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="tw-py-2 tw-px-6">
                {t('global.icon')}
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <IconAddLayer />
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <Button
          onClick={() => {
            eventDispatch(fitScreenSizeEvent());
          }}
          variant='soft'>
          <RiZoomInLine />
          {scale}%
        </Button>

        <IconButton
          variant='soft'
          disabled={true}>
          <RiPrinterLine />
        </IconButton>

        <IconButton
          variant='soft'
          onClick={onSaveDocumentClick}>
          <RiSaveLine />
        </IconButton>

      </Flex>
    </ScrollArea>
  );
});

export default QueueSubHeader;
