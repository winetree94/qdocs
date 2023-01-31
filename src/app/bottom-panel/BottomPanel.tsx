import clsx from 'clsx';
import { QueueButton, QueueIconButton } from 'components/button/Button';
import { FunctionComponent, ReactNode } from 'react';
import { useRecoilState } from 'recoil';
import { documentState } from 'store/document';
import { documentSettingsState } from 'store/settings';
import * as QueueContextMenu from 'components/queue-context-menu/Context';
import styles from './BottomPanel.module.scss';

export interface BottomPanelProps {
  children?: ReactNode;
}

export const BottomPanel: FunctionComponent<BottomPanelProps> = ({
  children,
}) => {
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const [settings, setSettings] = useRecoilState(documentSettingsState);

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

    setSettings({
      ...settings,
      queuePage: queueDocument!.pages.length,
      selectedObjectUUIDs: [],
      selectionMode: 'normal',
      queueStart: -1,
      queueIndex: 0,
      queuePosition: 'pause',
    });
  };

  const navigatePage = (index: number): void => {
    setSettings({
      ...settings,
      queuePage: index,
      selectedObjectUUIDs: [],
      selectionMode: 'normal',
      queueStart: -1,
      queueIndex: 0,
      queuePosition: 'pause',
    });
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
    setSettings({
      ...settings,
      queuePage: to,
      selectedObjectUUIDs: [],
      selectionMode: 'normal',
      queueStart: -1,
      queueIndex: 0,
      queuePosition: 'pause',
    });
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
    setSettings({
      ...settings,
      queuePage: index,
      selectedObjectUUIDs: [],
      selectionMode: 'normal',
      queueStart: -1,
      queueIndex: 0,
      queuePosition: 'pause',
    });
  };

  const removePage = (index: number): void => {
    const pages = [...queueDocument!.pages];
    pages.splice(index, 1);
    setQueueDocument({
      ...queueDocument!,
      pages,
    });
    setSettings({
      ...settings,
      queuePage: Math.min(index, pages.length - 1),
      selectedObjectUUIDs: [],
      selectionMode: 'normal',
      queueStart: -1,
      queueIndex: 0,
      queuePosition: 'pause',
    });
  };

  return (
    <div className={clsx(styles.container)}>
      <div className={clsx('flex')}>
        {queueDocument.pages.map((page, index, self) => (
          <QueueContextMenu.Root key={index}>
            <QueueContextMenu.Trigger>
              <QueueButton
                key={index}
                className={clsx(
                  styles.pageButton,
                  settings.queuePage === index && styles.selected,
                )}
                onClick={(): void => navigatePage(index)}>
                {page.pageName}
              </QueueButton>
            </QueueContextMenu.Trigger>
            <QueueContextMenu.Portal>
              <QueueContextMenu.Content
                onInteractOutside={(e): void => console.log(e)}>
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
      </div>
      <div>
        <QueueIconButton
          className={clsx(styles.pageButton, styles.button)}
          onClick={(): void => createPageAndMove()}>
          Add
        </QueueIconButton>
      </div>
    </div>
  );
};