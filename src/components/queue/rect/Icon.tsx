import clsx from 'clsx';
import { QueueIcon } from 'model/object/icon';
import { useContext } from 'react';
import { QueueObjectContainerContext, QueueObjectContainerContextType } from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';
import { RectProps } from '../Rect';
import symbolPath from 'assets/remixicon.symbol.svg';
import { convertHexWithOpacity } from 'components/queue/color/convertHex';

export const Icon = ({ onRectMousedown }: RectProps) => {
  const containerContext = useContext<QueueObjectContainerContextType<QueueIcon>>(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);
  const fill = convertHexWithOpacity(
    animation.fill.color,
    containerContext.object.fill.opacity * animation.fade.opacity * animation.fill.opacity,
  );

  return (
    <svg
      className={clsx('object-rect', 'absolute')}
      width={animation.rect.width}
      height={animation.rect.height}
      style={{
        top: `${animation.rect.y}px`,
        left: `${animation.rect.x}px`,
        transformOrigin: 'center center',
        transform: `rotate(${animation.rotate.degree}deg) scale(${animation.scale.scale})`,
      }}
      opacity={animation.fade.opacity}>
      <use onMouseDown={onRectMousedown} href={`${symbolPath}#${containerContext.object.iconType}`} fill={fill}></use>
    </svg>
  );
};
