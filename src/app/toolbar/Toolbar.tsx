import {
  FunctionComponent,
  ReactNode,
} from 'react';
import styles from './Toolbar.module.scss';
import * as Menubar from '@radix-ui/react-menubar';
import { documentState, QueueDocument } from 'store/document';
import { useRecoilState } from 'recoil';


export interface ToolbarModel {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  children: ToolbarModel[];
}

export interface ToolbarProps {
  onItemClicked?: (item: ToolbarModel) => void;
}

export const QueueToolbar: FunctionComponent<ToolbarProps> = ({
  onItemClicked,
}) => {
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);

  const items: ToolbarModel[] = [
    {
      key: 'file',
      label: <>File</>,
      children: [
        {
          key: 'new-document',
          label: <>New document</>,
          onClick: (): void => {
            setQueueDocument({
              documentName: 'Untitled',
              documentRect: {
                width: 1920,
                height: 1080,
              },
              objects: [],
            });
          },
          children: [],
        },
        {
          key: 'open-document',
          label: <>Open document</>,
          onClick: (): void => {
            const input = document.createElement('input');
            input.type = 'file';
            input.click();
            input.addEventListener('change', e => {
              console.log(e);
              try {
                if (!input.files) {
                  return;
                }
                const file = input.files[0];
                if (!file) {
                  return;
                }
                const fileReader = new FileReader();
                fileReader.onload = (e): void => {
                  const result = e.target?.result as string;
                  const document = JSON.parse(result) as QueueDocument;
                  setQueueDocument(document);
                };
                fileReader.readAsText(file);
              } catch (e) {
                console.warn(e);
              }
            });
          },
          children: [],
        },
        {
          key: 'save-document',
          label: <>Save document</>,
          onClick: (): void => {
            if (!queueDocument) return;
            const stringified = JSON.stringify(queueDocument);
            const blob = new Blob([stringified], { type: 'octet/stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${queueDocument.documentName}.que`;
            a.click();
            URL.revokeObjectURL(url);
          },
          children: [],
        }
      ]
    },
    {
      key: 'edit',
      label: <>Edit</>,
      children: [
        {
          key: 'edit-item',
          label: <>Edit item</>,
          children: [],
        }
      ]
    },
    {
      key: 'view',
      label: <>View</>,
      children: [
        {
          key: 'view-item',
          label: <>Edit item</>,
          children: [],
        }
      ]
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.title}>the queue</div>
      <div className={styles.rest}>
        <div className={styles.docTitle}>document title</div>
        <div>
          <Menubar.Root className={styles.MenubarRoot}>
            {
              items.map((item) => (
                <Menubar.Menu key={item.key}>
                  <Menubar.Trigger className={styles.MenubarTrigger}>
                    {item.label}
                  </Menubar.Trigger>
                  <Menubar.Portal>
                    <Menubar.Content
                      className={styles.MenubarContent}
                      align="start">
                      {item.children.map((child) => (
                        <Menubar.Item
                          key={child.key}
                          className={styles.MenubarItem}
                          onClick={(e): void => child.onClick?.()}>
                          {child.label}
                        </Menubar.Item>
                      ))}
                    </Menubar.Content>
                  </Menubar.Portal>
                </Menubar.Menu>
              ))
            }
          </Menubar.Root>
        </div>
      </div>
    </div>
  );
};
