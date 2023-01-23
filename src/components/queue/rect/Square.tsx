import clsx from 'clsx';
import { FunctionComponent, useContext } from 'react';
import { QueueObjectContainerContext } from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';
import { RectProps } from '../Rect';
import styles from './Square.module.scss';

export const Square: FunctionComponent<RectProps> = ({
  onRectMousedown
}) => {
  const containerContext = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);
  const margin = containerContext.object.stroke.width * 2;
  return (
    <svg
      className={clsx('object-rect', 'absolute')}
      width={animation.rect.width + containerContext.transform.width + margin}
      height={animation.rect.height + containerContext.transform.height + margin}
      style={{
        top: `${animation.rect.y + containerContext.transform.y - (margin / 2)}px`,
        left: `${animation.rect.x + containerContext.transform.x - (margin / 2)}px`,
      }}
    >
      <g>
        <rect
          className={clsx(styles.rect)}
          x={margin / 2}
          y={margin / 2}
          onMouseDown={onRectMousedown}
          width={animation.rect.width + containerContext.transform.width}
          height={animation.rect.height + containerContext.transform.height}
          fill={containerContext.object.fill.color}
          stroke={containerContext.object.stroke.color}
          strokeWidth={containerContext.object.stroke.width}
          strokeDasharray={containerContext.object.stroke.dasharray}
        ></rect>
      </g>
    </svg>
  );
};