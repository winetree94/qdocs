import { FunctionComponent, memo, ReactNode, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import styles from './ObjectPanel.module.scss';
import { RemixIconClasses } from 'cdk/icon/factory';
import { createDefaultSquare } from 'model/object/square';
import { createDefaultCircle } from 'model/object/circle';
import { createDefaultIcon } from 'model/object/icon';
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, FixedSizeList, ListOnScrollProps } from 'react-window';
import memoize from 'memoize-one';
import * as Tooltip from '@radix-ui/react-tooltip';
import { QueueDocumentRect } from 'model/document';
import { QueueObjectType } from 'model/object';
import { createDefaultLine } from 'model/object/line';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { QueueInput } from 'components/input/Input';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { DocumentSelectors } from 'store/document/selectors';
import { SettingSelectors } from 'store/settings/selectors';
import { ObjectActions } from '../../../store/object';
import { HistoryActions } from 'store/history';
import { SettingsActions } from 'store/settings';
import { useTranslation } from 'react-i18next';

export interface QueueObject {
  key: string;
  keyword: string[];
  tooltip?: string;
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

export const FlattenRow: FunctionComponent<FlattenRowProps> = memo(({ style, index, data }) => {
  const flattenData = data.flattenData[index];

  if (flattenData.type === 'group') {
    return (
      <div
        style={style}
        onClick={(e): void => data.toggleOpenedObjectGroup(flattenData.key)}
        className={clsx(styles.objectGroupTitle)}>
        <SvgRemixIcon
          className={styles.objectGroupArrow}
          width={15}
          height={15}
          icon={data.closedObjectGroupKey[flattenData.key] ? 'ri-arrow-right-s-line' : 'ri-arrow-down-s-line'}
        />
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
              <Tooltip.Content className={styles.TooltipContent} sideOffset={5}>
                {object.tooltip || object.key}
                <Tooltip.Arrow className={styles.TooltipArrow} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      ))}
    </div>
  );
}, areEqual);

// This helper function memoizes incoming props,
// To avoid causing unnecessary re-renders pure Row components.
// This is only needed since we are passing multiple props with a wrapper object.
// If we were only passing a single, stable value (e.g. items),
// We could just pass the value directly.
const createItemData = memoize(
  (
    flattenData: FlattenData[],
    closedObjectGroupKey: { [key: string]: boolean },
    toggleOpenedObjectGroup: (key: string) => void,
  ) => ({
    flattenData,
    closedObjectGroupKey,
    toggleOpenedObjectGroup,
  }),
);

export const ObjectPanel: FunctionComponent = () => {
  const { t } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const dispatch = useAppDispatch();
  const queueDocument = useAppSelector(DocumentSelectors.serialized);
  const settings = useAppSelector(SettingSelectors.settings);
  const [listScrollTopState, setListScrollTopState] = useState(0);

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
      createDefaultShape: (documentRect: QueueDocumentRect, queueIndex: number, iconType?: string) => QueueObjectType,
    ): ((iconClassName?: string) => void) => {
      return (iconClassName) => {
        const figure = createDefaultShape(queueDocument!.documentRect, settings.queueIndex, iconClassName);
        const object = {
          pageId: settings.pageId,
          ...figure,
        };
        delete object.effects; // 불필요한 값 스토어에 들어가는 것 방지, create 함수들이 스토어 모델을 반환하도록 개선 필요
        dispatch(HistoryActions.Capture());
        dispatch(
          ObjectActions.addOne({
            queueIndex: settings.queueIndex,
            object: object,
          }),
        );
        dispatch(
          SettingsActions.setSelection({
            selectionMode: 'normal',
            ids: [object.id],
          }),
        );
      };
    },
    [queueDocument, settings, dispatch],
  );

  const createSquare = createFigure(createDefaultSquare);
  const createCircle = createFigure(createDefaultCircle);
  const createIcon = createFigure(createDefaultIcon);
  const createLine = createFigure(createDefaultLine);

  const models = useMemo<QueueObjectGroup[]>(
    () => [
      {
        key: 'Shape',
        title: t('global.shape'),
        children: [
          {
            key: 'Rectangle',
            factory: () => createSquare(),
            keyword: [t('global.rectangle')],
            tooltip: t('global.rectangle'),
            preview: (
              <svg className={styles.canvas}>
                <g>
                  <rect width="30" height="30" stroke="black" strokeWidth="4" fill="transparent" />
                </g>
              </svg>
            ),
          },
          {
            key: 'Circle',
            factory: () => createCircle(),
            keyword: [t('global.circle')],
            tooltip: t('global.circle'),
            preview: (
              <svg className={styles.canvas}>
                <g>
                  <circle cx="15" cy="15" r="13" stroke="black" strokeWidth="2" fill="transparent" />
                </g>
              </svg>
            ),
          },
          {
            key: 'Line',
            factory: () => createLine(),
            keyword: [t('global.line')],
            tooltip: t('global.line'),
            preview: (
              <svg className={styles.canvas}>
                <g>
                  <line x1="0" y1="0" x2="42" y2="42" stroke="black" strokeWidth="2" fill="transparent" />
                </g>
              </svg>
            ),
          },
        ],
      },
      {
        key: 'Remix Icon',
        title: t('global.icon'),
        children: RemixIconClasses.map((iconClassName) => ({
          key: iconClassName,
          factory: () => createIcon(iconClassName),
          keyword: [iconClassName],
          preview: <SvgRemixIcon width={30} height={30} icon={iconClassName} />,
        })),
      },
    ],
    [t, createSquare, createCircle, createLine, createIcon],
  );

  const filteredGroups = useMemo(() => {
    if (searchKeyword === '') {
      return models;
    }
    return models.reduce<QueueObjectGroup[]>((result, group) => {
      const filtered = group.children.filter((child) =>
        child.keyword.some((keyword) => keyword.toLowerCase().includes(searchKeyword.toLowerCase())),
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
        if (!result[result.length - 1] || result[result.length - 1].length >= 4) {
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
        })),
      );
      return result;
    }, []);
  }, [filteredGroups, closedObjectGroupKey]);

  const memoizedItemData = createItemData(flattenItems, closedObjectGroupKey, toggleOpenedObjectGroup);

  const handleScroll = (props: ListOnScrollProps): void => {
    setListScrollTopState(props.scrollOffset);
  };

  return (
    <>
      <div className={clsx(styles.inputContainer)}>
        <QueueInput
          placeholder={t('object-panel.search-shape')}
          className={clsx(styles.input)}
          value={searchKeyword}
          onChange={(e): void => setSearchKeyword(e.target.value)}></QueueInput>
      </div>
      <QueueScrollArea.Root className={clsx(styles.ScrollAreaRoot)}>
        <QueueScrollArea.Viewport className={clsx(styles.ScrollAreaViewport)}>
          <AutoSizer>
            {({ height, width }): ReactNode => (
              <FixedSizeList
                itemCount={flattenItems.length}
                itemSize={50}
                width={width}
                height={height}
                itemKey={(index): string => flattenItems[index].key}
                itemData={memoizedItemData}
                initialScrollOffset={listScrollTopState}
                onScroll={handleScroll}>
                {FlattenRow}
              </FixedSizeList>
            )}
          </AutoSizer>
        </QueueScrollArea.Viewport>
        <QueueScrollArea.Scrollbar orientation="vertical">
          <QueueScrollArea.Thumb />
        </QueueScrollArea.Scrollbar>
        <QueueScrollArea.Scrollbar orientation="horizontal">
          <QueueScrollArea.Thumb />
        </QueueScrollArea.Scrollbar>
        <QueueScrollArea.Corner />
      </QueueScrollArea.Root>
    </>
  );
};
