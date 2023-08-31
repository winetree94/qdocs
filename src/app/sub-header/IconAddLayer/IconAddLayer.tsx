import { FunctionComponent, memo, ReactNode, useMemo, useState } from 'react';
import memoize from 'memoize-one';
import { areEqual, FixedSizeList, ListOnScrollProps } from 'react-window';
import * as Tooltip from '@radix-ui/react-tooltip';

import { useAppDispatch, useAppSelector } from 'store/hooks';
import { DocumentSelectors } from 'store/document/selectors';
import { SettingSelectors } from 'store/settings/selectors';
import { useCreateFigure } from 'cdk/hooks/useCreateFigure';
import { QueueIconButton } from 'components/buttons/button/Button';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { createDefaultLine } from 'model/object/line';
import clsx from 'clsx';
import styles from 'app/sub-header/IconAddLayer/IconAddLayer.module.scss';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';

interface QueueObject {
  key: string;
  keyword: string[];
  tooltip?: string;
  factory: () => void;
  preview: React.ReactNode;
}

interface QueueObjectGroup {
  key: string;
  title: string;
  children: QueueObject[];
}

interface FlattenQueueObjectGroup {
  type: 'group';
  key: string;
  title: string;
}

interface FlattenQueueObjectRow {
  type: 'row';
  key: string;
  objects: QueueObject[];
}

type FlattenData = FlattenQueueObjectGroup | FlattenQueueObjectRow;

interface FlattenRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    flattenData: FlattenData[];
    closedObjectGroupKey: { [key: string]: boolean };
    toggleOpenedObjectGroup: (key: string) => void;
  };
}

const FlattenRow: FunctionComponent<FlattenRowProps> = memo(
  ({ style, index, data }) => {
    const flattenData = data.flattenData[index];

    if (flattenData.type === 'group') {
      return (
        <div
          style={style}
          onClick={() => data.toggleOpenedObjectGroup(flattenData.key)}
          className={clsx(styles.objectGroupTitle)}>
          <SvgRemixIcon
            className={styles.objectGroupArrow}
            icon={
              data.closedObjectGroupKey[flattenData.key]
                ? 'ri-arrow-right-s-line'
                : 'ri-arrow-down-s-line'
            }
          />
          {flattenData.title}
        </div>
      );
    }

    return (
      <div className={clsx('tw-flex')} style={style}>
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
                  sideOffset={5}>
                  {object.tooltip || object.key}
                  <Tooltip.Arrow className={styles.TooltipArrow} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        ))}
      </div>
    );
  },
  areEqual,
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
    toggleOpenedObjectGroup: (key: string) => void,
  ) => ({
    flattenData,
    closedObjectGroupKey,
    toggleOpenedObjectGroup,
  }),
);

const QueueIconAddLayer = () => {
  const queueDocument = useAppSelector(DocumentSelectors.serialized);
  const settings = useAppSelector(SettingSelectors.settings);
  const dispatch = useAppDispatch();

  const createFigure = useCreateFigure(queueDocument, settings, dispatch);

  return <div>123</div>;
};

export default QueueIconAddLayer;
