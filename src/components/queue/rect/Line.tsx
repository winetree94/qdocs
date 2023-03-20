import clsx from 'clsx';
import { convertHexWithOpacity } from 'components/queue/color/convertHex';
import { useContext } from 'react';
import { QueueObjectContainerContext } from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';
import { RectProps } from '../Rect';
import styles from './Square.module.scss';

export const Line = ({ onRectMousedown }: RectProps) => {
  const containerContext = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);
  const strokeClipPathID = `stroke-alignment-inner-for-rect-${containerContext.object.id}`;
  const fill = convertHexWithOpacity(
    animation.fill.color,
    containerContext.object.fill.opacity * animation.fade.opacity * animation.fill.opacity,
  );

  const x1 = 0;
  const x2 = x1 + animation.rect.width;
  const y1 = 0;
  const y2 = y1 + animation.rect.height;

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
      viewBox={`0 0 ${Math.abs(animation.rect.width)} ${Math.abs(animation.rect.height)}`}
      opacity={animation.fade.opacity}>
      <line
        className={clsx(styles.rect)}
        onMouseDown={onRectMousedown}
        x1={animation.rect.width > 0 ? x1 : x1 - animation.rect.width}
        x2={animation.rect.width > 0 ? x2 : 0}
        y1={animation.rect.height > 0 ? y1 : y1 - animation.rect.height}
        y2={animation.rect.height > 0 ? y2 : 0}
        fill={fill}
        opacity={containerContext.object.opacity}
        stroke={containerContext.object.stroke.color}
        strokeWidth={containerContext.object.stroke.width * 2}
        strokeDasharray={containerContext.object.stroke.dasharray}
        clipPath={`url(#${strokeClipPathID})`}
      />
    </svg>
  );
};
