import clsx from 'clsx';
import { QueueIcon } from 'model/object/icon';
import { FunctionComponent, useContext } from 'react';
import { QueueObjectContainerContext, QueueObjectContainerContextType } from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';
import { RectProps } from '../Rect';

export const Icon: FunctionComponent<RectProps> = ({
  onRectMousedown
}) => {
  const containerContext = useContext<QueueObjectContainerContextType<QueueIcon>>(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);
  return (
    <svg
      className={clsx('object-rect', 'absolute')}
      width={animation.rect.width + containerContext.transform.width}
      height={animation.rect.height + containerContext.transform.height}
      style={{
        top: `${animation.rect.y + containerContext.transform.y}px`,
        left: `${animation.rect.x + containerContext.transform.x}px`,
        transformOrigin: 'center center',
        transform: `rotate(${animation.rotate.degree + containerContext.transformRotate.degree}deg)`,
      }}
      opacity={containerContext.object.fill.opacity}
    >
      <use
        onMouseDown={onRectMousedown}
        href={`/remixicon.symbol.svg#${containerContext.object.iconType}`}
        fill={containerContext.object.fill.color}
      ></use>
    </svg>
  );
};