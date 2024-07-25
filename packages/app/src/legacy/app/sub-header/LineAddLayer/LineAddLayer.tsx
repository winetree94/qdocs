import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { SettingSelectors } from '@legacy/store/settings/selectors';
import { useCreateFigure } from '@legacy/cdk/hooks/useCreateFigure';
import { QUEUE_UI_SIZE } from '@legacy/styles/ui/Size';
import { createDefaultLine } from '@legacy/model/object/line';
import styles from './LineAddLayer.module.scss';
import clsx from 'clsx';
import { IconButton } from '@radix-ui/themes';

const QueueLineAddLayer = () => {
  const currentPageId = useAppSelector(SettingSelectors.pageId);
  const currentQueueIndex = useAppSelector(SettingSelectors.queueIndex);
  const dispatch = useAppDispatch();

  const createFigure = useCreateFigure(
    currentPageId,
    currentQueueIndex,
    dispatch,
  );
  const createLine = createFigure(createDefaultLine);

  return (
    <div className={clsx(styles.wrapper)}>
      <IconButton onClick={() => createLine()}>
        <svg className={'tw-w-4 tw-h-4'}>
          <g>
            <line
              x1="0"
              y1="0"
              x2="22"
              y2="22"
              stroke="black"
              strokeWidth="2"
              fill="transparent"
            />
          </g>
        </svg>
      </IconButton>
    </div>
  );
};

export default QueueLineAddLayer;
