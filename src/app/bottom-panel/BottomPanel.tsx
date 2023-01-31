import clsx from 'clsx';
import { QueueIconButton } from 'components/button/Button';
import { FunctionComponent, ReactNode, useState } from 'react';
import { useRecoilState } from 'recoil';
import { documentState } from 'store/document';
import * as QueueContextMenu from 'components/queue-context-menu/Context';
import styles from './BottomPanel.module.scss';
import { QueueToggleGroupItem, QueueToogleGroupRoot } from 'components/toggle-group/ToogleGroup';
import { useSettings } from 'cdk/hooks/settings';

export interface BottomPanelProps {
  children?: ReactNode;
}

export const BottomPanel: FunctionComponent<BottomPanelProps> = ({
  children,
}) => {
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const { settings, ...setSettings } = useSettings();
  const [dragOverIndex, setDragOverIndex] = useState(-1);

  const createPageAndMove = (): void => {
    setQueueDocument({
      ...queueDocument!,
      pages: [
        ...queueDocument!.pages,
        {
          pageName: `Page-${queueDocument!.pages.length + 1}`,
          objects: [],
        }
      ]
    });
    setSettings.setQueuePageIndex(queueDocument!.pages.length);
  };

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

  return (
    <div className={clsx(styles.container)}>
      <div className={clsx(styles.pageHolder)}>
        <QueueToogleGroupRoot
          type="single"
          value={`${settings.queuePage}`}
          onValueChange={(value): void => navigatePage(Number(value))}
        >
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
                onDrop={onDrop}>
                <QueueToggleGroupItem
                  value={`${index}`}>
                  {page.pageName}
                </QueueToggleGroupItem>
              </QueueContextMenu.Trigger>
              <QueueContextMenu.Portal>
                <QueueContextMenu.Content>
                  <QueueContextMenu.Item onClick={(): void => movePage(index, Math.max(index - 1, 0))}>
                    왼쪽으로 페이지 이동
                  </QueueContextMenu.Item>
                  <QueueContextMenu.Item onClick={(): void => movePage(index, Math.min(index + 1, self.length - 1))}>
                    오른쪽으로 페이지 이동
                  </QueueContextMenu.Item>
                  <QueueContextMenu.Separator />
                  <QueueContextMenu.Item onClick={(): void => createPage(Math.max(index, 0))}>
                    왼쪽에 페이지 추가
                  </QueueContextMenu.Item>
                  <QueueContextMenu.Item onClick={(): void => createPage(Math.min(index + 1, self.length - 1))}>
                    오른쪽에 페이지 추가
                  </QueueContextMenu.Item>
                  <QueueContextMenu.Separator />
                  <QueueContextMenu.Item
                    className={styles.Remove}
                    onClick={(): void => removePage(index)}>
                    페이지 삭제
                  </QueueContextMenu.Item>
                </QueueContextMenu.Content>
              </QueueContextMenu.Portal>
            </QueueContextMenu.Root>
          ))}
        </QueueToogleGroupRoot>
      </div>
      <div>
        <QueueIconButton
          className={clsx(styles.pageButton, styles.button)}
          onClick={(): void => createPageAndMove()}>
          <i className='ri-add-fill'></i>
        </QueueIconButton>
      </div>
    </div>
  );
};