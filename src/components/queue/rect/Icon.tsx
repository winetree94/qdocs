import clsx from 'clsx';
import { QueueIcon } from 'model/object/icon';
import { FunctionComponent, useContext } from 'react';
import {
  QueueObjectContainerContext,
  QueueObjectContainerContextType,
} from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';
import { RectProps } from '../Rect';
import symbolPath from 'assets/remixicon.symbol.svg';

export const Icon: FunctionComponent<RectProps> = ({ onRectMousedown }) => {
  const containerContext = useContext<
    QueueObjectContainerContextType<QueueIcon>
  >(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);
  return (
    <svg
      className={clsx('object-rect', 'absolute')}
      width={animation.rect.width}
      height={animation.rect.height}
      style={{
        top: `${animation.rect.y}px`,
        left: `${animation.rect.x}px`,
        transformOrigin: 'center center',
        transform: `rotate(${animation.rotate.degree}deg)`,
      }}
      opacity={containerContext.object.fade.opacity}>
      <use
        onMouseDown={onRectMousedown}
        href={`${symbolPath}#${containerContext.object.iconType}`}
        fill={containerContext.object.fill.color}></use>
    </svg>
  );
};
