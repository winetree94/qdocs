import {
  Fragment,
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { Popover } from '../../components/popover/Popover';
import { Toolbar, ToolbarItem } from '../../components/toolbar/Toolbar';
import styles from './Toolbar.module.scss';

export interface ToolbarModel {
  opened?: boolean;
  label: string;
  node: ReactNode;
}

export interface ToolbarProps {
  onItemClicked?: (item: ToolbarModel) => void;
}

export const QueueToolbar: FunctionComponent<ToolbarProps> = ({
  onItemClicked,
}) => {
  const items: ToolbarModel[] = [
    {
      label: 'File',
      node: <>File</>,
    },
    {
      label: 'Edit',
      node: <>Edit</>,
    },
    {
      label: 'View',
      node: <>View</>,
    },
  ];

  const [target, setTarget] = useState<HTMLButtonElement | null>(null);
  const [openedLabel, setOpenedLabel] = useState<string>('');

  const openMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: ToolbarModel
  ): void => {
    if (openedLabel === item.label) {
      setTarget(null);
      setOpenedLabel('');
      return;
    }
    setTarget(event.currentTarget);
    setOpenedLabel(item.label);
  };

  useEffect(() => {
    const listener = (event: MouseEvent): void => {
      if (event.target !== target) {
        setTarget(null);
        setOpenedLabel('');
      }
    };
    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  }, [target, openedLabel]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>the queue</div>
      <div className={styles.rest}>
        <div className={styles.docTitle}>document title</div>
        <div>
          <Toolbar>
            {items.map((item) => (
              <Fragment key={item.label}>
                <ToolbarItem onClick={(event): void => openMenu(event, item)}>
                  {item.label}
                </ToolbarItem>
                <Popover
                  target={target}
                  visible={openedLabel === item.label}
                  useBackdrop={false}
                >
                  {item.node}
                </Popover>
              </Fragment>
            ))}
          </Toolbar>
        </div>
      </div>
    </div>
  );
};
