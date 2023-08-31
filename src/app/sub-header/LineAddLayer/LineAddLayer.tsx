import { useAppDispatch, useAppSelector } from 'store/hooks';
import { DocumentSelectors } from 'store/document/selectors';
import { SettingSelectors } from 'store/settings/selectors';
import { useCreateFigure } from 'cdk/hooks/useCreateFigure';
import { QueueIconButton } from 'components/buttons/button/Button';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { createDefaultLine } from 'model/object/line';
import styles from './LineAddLayer.module.scss';
import clsx from 'clsx';

const QueueLineAddLayer = () => {
  const queueDocument = useAppSelector(DocumentSelectors.serialized);
  const settings = useAppSelector(SettingSelectors.settings);
  const dispatch = useAppDispatch();

  const createFigure = useCreateFigure(queueDocument, settings, dispatch);
  const createLine = createFigure(createDefaultLine);

  return (
    <div className={clsx(styles.wrapper)}>
      <QueueIconButton size={QUEUE_UI_SIZE.MEDIUM} onClick={() => createLine()}>
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
      </QueueIconButton>
    </div>
  );
};

export default QueueLineAddLayer;
