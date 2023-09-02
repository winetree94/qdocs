import { useAppDispatch, useAppSelector } from 'store/hooks';
import { DocumentSelectors } from 'store/document/selectors';
import { SettingSelectors } from 'store/settings/selectors';
import { useCreateFigure } from 'cdk/hooks/useCreateFigure';
import { createDefaultSquare } from 'model/object/square';
import { createDefaultCircle } from 'model/object/circle';
import { createDefaultIcon } from 'model/object/icon';
import { QueueIconButton } from 'components/buttons/button/Button';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import styles from './RectAddLayer.module.scss';
import clsx from 'clsx';

const QueueRectAddLayer = () => {
  const queueDocument = useAppSelector(DocumentSelectors.serialized);
  const currentPageId = useAppSelector(SettingSelectors.pageId);
  const currentQueueIndex = useAppSelector(SettingSelectors.queueIndex);
  const dispatch = useAppDispatch();

  const createFigure = useCreateFigure(
    queueDocument,
    currentPageId,
    currentQueueIndex,
    dispatch,
  );
  const createSquare = createFigure(createDefaultSquare);
  const createCircle = createFigure(createDefaultCircle);

  return (
    <div className={clsx(styles.wrapper)}>
      <QueueIconButton
        size={QUEUE_UI_SIZE.MEDIUM}
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
      </QueueIconButton>
      <QueueIconButton
        size={QUEUE_UI_SIZE.MEDIUM}
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
      </QueueIconButton>
    </div>
  );
};

export default QueueRectAddLayer;
