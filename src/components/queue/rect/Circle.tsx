import clsx from 'clsx';
import { FunctionComponent, useContext } from 'react';
import { QueueObjectContainerContext } from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';
import { RectProps } from '../Rect';
import styles from './Circle.module.scss';

export const Circle: FunctionComponent<RectProps> = ({
  onRectMousedown,
}) => {
  const containerContext = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);

  const margin = containerContext.object.stroke.width * 2;
  const rx = (animation.rect.width + containerContext.transform.width) / 2;
  const ry = (animation.rect.height + containerContext.transform.height) / 2;

  return (
    <svg
      className={clsx('object-circle', 'absolute')}
      width={animation.rect.width + containerContext.transform.width + margin}
      height={animation.rect.height + containerContext.transform.height + margin}
      style={{
        top: `${animation.rect.y + containerContext.transform.y - (margin / 2)}px`,
        left: `${animation.rect.x + containerContext.transform.x - (margin / 2)}px`,
      }}
    >
      <g>
        <ellipse
          onMouseDown={onRectMousedown}
          className={clsx(styles.circle)}
          cx={rx + (margin / 2)}
          cy={ry + (margin / 2)}
          rx={rx}
          ry={ry}
          stroke={containerContext.object.stroke.color}
          strokeWidth={containerContext.object.stroke.width}
          strokeDasharray={containerContext.object.stroke.dasharray}
          fill="transparent"
        >
        </ellipse>
      </g>
    </svg>
  );
};