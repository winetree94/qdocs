import clsx from 'clsx';
import { FunctionComponent, useContext } from 'react';
import { QueueObjectContainerContext } from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';

export const Circle: FunctionComponent = () => {
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
          cx={rx + (margin / 2)}
          cy={ry + (margin / 2)}
          rx={rx}
          ry={ry}
          stroke={containerContext.object.stroke.color}
          stroke-width={containerContext.object.stroke.width}
          stroke-dasharray={containerContext.object.stroke.dasharray}
          fill="transparent"
        >
        </ellipse>
      </g>
    </svg>
  );
};