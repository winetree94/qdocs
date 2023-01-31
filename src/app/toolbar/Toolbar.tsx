import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import styles from './Toolbar.module.scss';
import * as Menubar from '@radix-ui/react-menubar';
import { documentState } from 'store/document';
import { useRecoilState } from 'recoil';
import clsx from 'clsx';
import { CookieIcon } from '@radix-ui/react-icons';
import { QueueDocument } from 'model/document';


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
  const [documentTitle, setDocumentTitle] = useState('');

  useEffect(() => {
    setDocumentTitle(queueDocument?.documentName || '');
  }, [queueDocument?.documentName]);

  const onTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setDocumentTitle(event.target.value);
  };

  const onTitleInputBlur = (): void => {
    const previous = (queueDocument?.documentName || '').trim();
    const current = documentTitle.trim();
    if (previous !== current) {
      setQueueDocument({
        ...queueDocument!,
        documentName: current,
      });
    }
  };

  const items: ToolbarModel[] = [
    {
      key: 'file',
      label: <>파일</>,
      children: [
        // 새로운 문서를 생성
        {
          key: 'new-document',
          label: <>새 문서</>,
          onClick: (): void => {
            setQueueDocument({
              documentName: 'Untitled',
              documentRect: {
                width: 1920,
                height: 1080,
                fill: '#ffffff',
              },
              pages: [{
                pageName: 'Page-1',
                objects: [],
              }],
            });
          },
          children: [],
        },
        // 문서 열기
        {
          key: 'open-document',
          label: <>문서 열기</>,
          onClick: (): void => {
            const input = document.createElement('input');
            input.type = 'file';
            input.click();
            input.addEventListener('change', e => {
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
        // 문서 저장
        {
          key: 'save-document',
          label: <>문서 저장</>,
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
      label: <>수정</>,
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
      label: <>보기</>,
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
    <div className={clsx('flex', styles.container)}>
      <div className={clsx('flex', 'justify-center', 'items-center', styles.iconContainer)}>
        <CookieIcon height={40} width={40} />
      </div>
      <div className={clsx('flex', 'flex-col', 'flex-auto')}>
        <div className={clsx('m-2.5')}>
          <input
            className={styles.titleInput}
            disabled={!queueDocument}
            type="text"
            value={documentTitle}
            onChange={onTitleInputChange}
            onBlur={onTitleInputBlur}
          />
        </div>
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
