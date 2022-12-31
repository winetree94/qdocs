import { css } from '@emotion/css';
import {
  Fragment,
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { Popover } from '../../components/popover/Popover';
import { Toolbar, ToolbarItem } from '../../components/toolbar/Toolbar';

interface ToolbarModel {
  opened?: boolean;
  label: string;
  node: ReactNode;
}

export const ToolbarLayout: FunctionComponent = () => {
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
    <div
      className={css`
        display: flex;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      `}
    >
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        the queue
      </div>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
        `}
      >
        <div
          className={css`
            margin: 10px;
          `}
        >
          document title
        </div>
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
