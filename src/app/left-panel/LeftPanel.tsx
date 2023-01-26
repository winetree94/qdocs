/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FunctionComponent,
  memo,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
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
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, FixedSizeList } from 'react-window';
import memoize from 'memoize-one';
import * as Tooltip from '@radix-ui/react-tooltip';
import { QueueDocumentRect } from 'model/document';
import { QueueObjectType } from 'model/object';

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

export interface FlattenQueueObjectGroup {
  type: 'group';
  key: string;
  title: string;
}

export interface FlattenQueueObjectRow {
  type: 'row';
  key: string;
  objects: QueueObject[];
}

export type FlattenData = FlattenQueueObjectGroup | FlattenQueueObjectRow;

export interface FlattenRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    flattenData: FlattenData[];
    closedObjectGroupKey: { [key: string]: boolean };
    toggleOpenedObjectGroup: (key: string) => void;
  };
}

export const FlattenRow: FunctionComponent<FlattenRowProps> = memo(
  ({ style, index, data }) => {
    const flattenData = data.flattenData[index];

    if (flattenData.type === 'group') {
      return (
        <div
          style={style}
          onClick={(e): void => data.toggleOpenedObjectGroup(flattenData.key)}
          className={clsx(styles.objectGroupTitle)}
        >
          <i
            className={clsx(
              styles.objectGroupArrow,
              data.closedObjectGroupKey[flattenData.key]
                ? 'ri-arrow-right-s-line'
                : 'ri-arrow-down-s-line'
            )}
          ></i>
          {flattenData.title}
        </div>
      );
    }

    return (
      <div className={clsx('flex')} style={style}>
        {flattenData.objects.map((object) => (
          <Tooltip.Provider key={object.key}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div onClick={object.factory} className={clsx(styles.object)}>
                  {object.preview}
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className={styles.TooltipContent}
                  sideOffset={5}
                >
                  {object.key}
                  <Tooltip.Arrow className={styles.TooltipArrow} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        ))}
      </div>
    );
  },
  areEqual
);

// This helper function memoizes incoming props,
// To avoid causing unnecessary re-renders pure Row components.
// This is only needed since we are passing multiple props with a wrapper object.
// If we were only passing a single, stable value (e.g. items),
// We could just pass the value directly.
const createItemData = memoize(
  (
    flattenData: FlattenData[],
    closedObjectGroupKey: { [key: string]: boolean },
    toggleOpenedObjectGroup: (key: string) => void
  ) => ({
    flattenData,
    closedObjectGroupKey,
    toggleOpenedObjectGroup,
  })
);

export const LeftPanel: FunctionComponent = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const [settings, setSettings] = useRecoilState(documentSettingsState);

  const [closedObjectGroupKey, setClosedObjectGroupKey] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleOpenedObjectGroup = (key: string): void => {
    setClosedObjectGroupKey({
      ...closedObjectGroupKey,
      [key]: !closedObjectGroupKey[key],
    });
  };

  const createFigure = useCallback(
    (
      createDefaultShape: (
        documentRect: QueueDocumentRect,
        queueIndex: number,
        iconType?: string
      ) => QueueObjectType
    ): ((iconClassName?: string) => void) => {
      return () => {
        const figure = createDefaultShape(
          queueDocument!.documentRect,
          settings.queueIndex
        );
        const newPages = queueDocument!.pages.slice(0);
        newPages[settings.queuePage] = {
          ...queueDocument!.pages[settings.queuePage],
          objects: queueDocument!.pages[settings.queuePage].objects.slice(0),
        };
        newPages[settings.queuePage].objects.push(figure);
        setQueueDocument({
          ...queueDocument!,
          pages: newPages,
        });
        setSettings({
          ...settings,
          selectedObjectUUIDs: [figure.uuid],
        });
      };
    },
    [queueDocument, settings, setQueueDocument, setSettings]
  );

  const createSquare = createFigure(createDefaultSquare);
  const createCircle = createFigure(createDefaultCircle);
  const createIcon = createFigure(createDefaultIcon);

  const models = useMemo<QueueObjectGroup[]>(
    () => [
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
                  <circle
                    cx="15"
                    cy="15"
                    r="13"
                    stroke="black"
                    strokeWidth="2"
                    fill="transparent"
                  />
                </g>
              </svg>
            ),
          },
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
      },
    ],
    [createIcon, createSquare, createCircle]
  );

  const filteredGroups = useMemo(() => {
    if (searchKeyword === '') {
      return models;
    }
    return models.reduce<QueueObjectGroup[]>((result, group) => {
      const filtered = group.children.filter((child) =>
        child.keyword.some((keyword) =>
          keyword.toLowerCase().includes(searchKeyword.toLowerCase())
        )
      );
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

  const flattenItems = useMemo<FlattenData[]>(() => {
    return filteredGroups.reduce<FlattenData[]>((result, group) => {
      result.push({
        type: 'group',
        key: group.key,
        title: group.title,
      });
      if (closedObjectGroupKey[group.key]) {
        return result;
      }
      const rows = group.children.reduce<QueueObject[][]>((result, child) => {
        if (
          !result[result.length - 1] ||
          result[result.length - 1].length >= 4
        ) {
          result.push([]);
        }
        const row = result[result.length - 1];
        row.push(child);
        return result;
      }, []);
      result.push(
        ...rows.map<FlattenQueueObjectRow>((row) => ({
          key: row.map((object) => object.key).join('-'),
          type: 'row',
          objects: row,
        }))
      );
      return result;
    }, []);
  }, [filteredGroups, closedObjectGroupKey]);

  const memoizedItemData = createItemData(
    flattenItems,
    closedObjectGroupKey,
    toggleOpenedObjectGroup
  );

  return (
    <div className={clsx(styles.container, 'flex', 'flex-col')}>
      <div className={clsx(styles.inputContainer)}>
        <Input
          placeholder="Search Shape"
          className={clsx(styles.input)}
          value={searchKeyword}
          onChange={(e): void => setSearchKeyword(e.target.value)}
        ></Input>
      </div>
      <div className={clsx('flex', 'flex-1')}>
        <AutoSizer>
          {({ height, width }): ReactNode => (
            <FixedSizeList
              itemCount={flattenItems.length}
              itemSize={50}
              width={width}
              height={height}
              itemKey={(index): string => flattenItems[index].key}
              itemData={memoizedItemData}
            >
              {FlattenRow}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};
