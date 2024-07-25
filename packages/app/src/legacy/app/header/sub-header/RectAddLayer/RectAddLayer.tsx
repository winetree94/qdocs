import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { SettingSelectors } from '@legacy/store/settings/selectors';
import { useCreateFigure } from '@legacy/cdk/hooks/useCreateFigure';
import { createDefaultSquare } from '@legacy/model/object/square';
import { createDefaultCircle } from '@legacy/model/object/circle';
import styles from './RectAddLayer.module.scss';
import clsx from 'clsx';
import { IconButton } from '@radix-ui/themes';

const QueueRectAddLayer = () => {
  const currentPageId = useAppSelector(SettingSelectors.pageId);
  const currentQueueIndex = useAppSelector(SettingSelectors.queueIndex);
  const dispatch = useAppDispatch();

  const createFigure = useCreateFigure(
    currentPageId,
    currentQueueIndex,
    dispatch,
  );
  const createSquare = createFigure(createDefaultSquare);
  const createCircle = createFigure(createDefaultCircle);

  return (
    <div className={clsx(styles.wrapper)}>
      <IconButton
        onClick={() => createSquare()}>
        <svg className={'tw-w-4 tw-h-4'}>
          <g>
            <rect
              width="16"
              height="16"
              stroke="black"
              strokeWidth="4"
              fill="transparent"
            />
          </g>
        </svg>
      </IconButton>
      <IconButton
        onClick={() => createCircle()}>
        <svg className={'tw-w-4 tw-h-4'}>
          <g>
            <circle
              cx="8"
              cy="8"
              r="7"
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

export default QueueRectAddLayer;
