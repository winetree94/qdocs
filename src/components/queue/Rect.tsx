import clsx from 'clsx';
import { FunctionComponent, useContext } from 'react';
import { QueueObjectContainerContext } from './Container';
import { QueueAnimatableContext } from './QueueAnimation';

export const Rect: FunctionComponent = () => {
  const containerContext = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);
  return (
    <svg
      className={clsx('object-rect', 'absolute')}
      width={animation.rect.width + containerContext.transform.width}
      height={animation.rect.height + containerContext.transform.height}
      style={{
        top: `${animation.rect.y + containerContext.transform.y}px`,
        left: `${animation.rect.x + containerContext.transform.x}px`,
      }}
    >
      <g>
        <rect
          x={0}
          y={0}
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