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
      <use xlinkHref={`/remixicon.symbol.svg#${containerContext.object.iconType}`}></use>
    </svg>
  );
};