import clsx from 'clsx';
import { Button } from 'components/button/Button';
import { FunctionComponent, ReactNode } from 'react';
import { useRecoilState } from 'recoil';
import { documentState } from 'store/document';
import { documentSettingsState } from 'store/settings';
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

  const movePage = (index: number): void => {
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

  return (
    <div className={clsx(styles.container)}>
      <div className={clsx('flex')}>
        {queueDocument.pages.map((page, index) => (
          <Button
            key={index}
            className={clsx(
              styles.pageButton,
              settings.queuePage === index && styles.selected,
            )}
            onClick={(): void => movePage(index)}>
            {index + 1}
          </Button>
        ))}
      </div>
      <div>
        <Button
          className={clsx(styles.pageButton, styles.button)}
          onClick={(): void => createPageAndMove()}>
          Add
        </Button>
      </div>
    </div>
  );
};