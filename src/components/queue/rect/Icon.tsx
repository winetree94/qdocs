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
      width={Math.abs(animation.rect.width)}
      height={Math.abs(animation.rect.height)}
      style={{
        top: `${animation.rect.height > 0 ? animation.rect.y : animation.rect.y + animation.rect.height}px`,
        left: `${animation.rect.width > 0 ? animation.rect.x : animation.rect.x + animation.rect.width}px`,
        transformOrigin: 'center center',
        transform: `rotate(${animation.rotate.degree}deg) scale(${animation.scale.scale})`,
      }}
      opacity={animation.fade.opacity}>
      <use onMouseDown={onRectMousedown} href={`${symbolPath}#${containerContext.object.iconType}`} fill={fill}></use>
    </svg>
  );
};
