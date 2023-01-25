import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useRecoilState } from 'recoil';
import { Input } from '../../components/input/Input';
import { documentSettingsState } from '../../store/settings';
import { documentState } from '../../store/document';
import styles from './LeftPanel.module.scss';
import { RemixIconClasses } from 'cdk/icon/factory';
import { createDefaultSquare } from 'model/object/square';
import { createDefaultCircle } from 'model/object/circle';
import { createDefaultIcon } from 'model/object/icon';

export interface QueueObject {
  key: string;
  keyword: string[];
  factory: () => void;
  preview: React.ReactNode;
}

export interface QueueObjectGroup {
  key: string;
  title: string;
  children: QueueObject[];
}

export const LeftPanel: FunctionComponent = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const [settings, setSettings] = useRecoilState(documentSettingsState);

  const [openedObjectGroupKey, setOpenedObjectGroupKey] = useState<{ [key: string]: boolean; }>({});

  const toggleOpenedObjectGroup = (key: string): void => {
    setOpenedObjectGroupKey({
      ...openedObjectGroupKey,
      [key]: !openedObjectGroupKey[key],
    });
  };

  const createSquare = useCallback((): void => {
    const square = createDefaultSquare(
      queueDocument!.documentRect,
      settings.queueIndex,
    );
    setQueueDocument({
      ...queueDocument!,
      objects: [
        ...queueDocument!.objects,
        square,
      ],
    });
    setSettings({
      ...settings,
      selectedObjectUUIDs: [square.uuid],
    });
  }, [queueDocument, settings, setQueueDocument, setSettings]);

  const createCircle = useCallback((): void => {
    const circle = createDefaultCircle(
      queueDocument!.documentRect,
      settings.queueIndex,
    );
    setQueueDocument({
      ...queueDocument!,
      objects: [
        ...queueDocument!.objects,
        circle,
      ],
    });
    setSettings({
      ...settings,
      selectedObjectUUIDs: [circle.uuid],
    });
  }, [queueDocument, settings, setQueueDocument, setSettings]);

  const createIcon = useCallback((iconClassName: string): void => {
    const icon = createDefaultIcon(
      queueDocument!.documentRect,
      settings.queueIndex,
      iconClassName,
    );
    setQueueDocument({
      ...queueDocument!,
      objects: [
        ...queueDocument!.objects,
        icon,
      ],
    });
    setSettings({
      ...settings,
      selectedObjectUUIDs: [icon.uuid],
    });
  }, [queueDocument, settings, setQueueDocument, setSettings]);

  const models = useMemo<QueueObjectGroup[]>(() => [
    {
      key: 'Shape',
      title: 'Shape',
      children: [
        {
          key: 'Rectangle',
          factory: () => createSquare(),
          keyword: ['Rectangle'],
          preview: (
            <svg className={styles.canvas}>
              <g>
                <rect
                  width="30"
                  height="30"
                  stroke="black"
                  strokeWidth="4"
                  fill="transparent"
                />
              </g>
            </svg>
          ),
        },
        {
          key: 'Circle',
          keyword: ['Circle'],
          factory: () => createCircle(),
          preview: (
            <svg className={styles.canvas}>
              <g>
                <circle cx="15" cy="15" r="13" stroke="black" strokeWidth="2" fill="transparent" />
              </g>
            </svg>
          )
        }
      ],
    },
    {
      key: 'Remix Icon',
      title: 'Remix Icon',
      children: RemixIconClasses.map((iconClassName) => ({
        key: iconClassName,
        factory: () => createIcon(iconClassName),
        keyword: [iconClassName],
        preview: (
          <svg width={30} height={30}>
            <use href={`/remixicon.symbol.svg#${iconClassName}`}></use>
          </svg>
        ),
      })),
    }
  ], [
    createIcon,
    createSquare,
    createCircle,
  ]);

  const filteredGroups = useMemo(() => {
    if (searchKeyword === '') {
      return models;
    }
    return models.reduce<QueueObjectGroup[]>((result, group) => {
      const filtered = group.children.filter((child) => child.keyword.some(
        (keyword) => keyword.toLowerCase().includes(searchKeyword.toLowerCase())
      ));
      if (filtered.length === 0) {
        return result;
      }
      result.push({
        ...group,
        children: filtered,
      });
      return result;
    }, []);
  }, [models, searchKeyword]);

  return (
    <div className={clsx(
      styles.container,
      'flex',
      'flex-col'
    )}>
      <div className={clsx(
        styles.inputContainer
      )}>
        <Input
          placeholder="Search Shape"
          className={clsx(
            styles.input,
          )}
          value={searchKeyword}
          onChange={(e): void => setSearchKeyword(e.target.value)}></Input>
      </div>
      <div className={clsx(
        'flex-1',
        'flex',
        'flex-col',
        'overflow-y-auto',
      )}>
        {filteredGroups.map((model) => (
          <div
            key={model.key}
            className={clsx(
              styles.objectGroup,
            )}>
            <div
              onClick={(e): void => toggleOpenedObjectGroup(model.key)}
              className={clsx(
                styles.objectGroupTitle,
              )}>
              <i
                className={clsx(
                  styles.objectGroupArrow,
                  !openedObjectGroupKey[model.key] ? 'ri-arrow-right-s-line' : 'ri-arrow-down-s-line'
                )}></i>
              {model.title}
            </div>
            {!openedObjectGroupKey[model.key] && (
              <div
                className={clsx(
                  styles.objectList
                )}>
                {model.children.map((child) => (
                  <div
                    key={child.key}
                    onClick={child.factory}
                    className={clsx(
                      styles.object,
                    )}>
                    {child.preview}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
