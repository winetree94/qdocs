import clsx from 'clsx';
import { convertHex } from 'components/queue/color/convertHex';
import { useContext } from 'react';
import { QueueObjectContainerContext } from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';
import { RectProps } from '../Rect';
import styles from './Square.module.scss';

export const Line = ({ onRectMousedown }: RectProps) => {
  const containerContext = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);
  const strokeClipPathID = `stroke-alignment-inner-for-rect-${containerContext.object.id}`;
  const fill = convertHex(containerContext.object.fill.color, containerContext.object.fill.opacity);

  const x1 = 0;
  const x2 = x1 + animation.rect.width;
  const y1 = 0;
  const y2 = y1 + animation.rect.height;

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
      viewBox={`0 0 ${animation.rect.width} ${animation.rect.height}`}
      opacity={animation.fade.opacity}>
      <line
        className={clsx(styles.rect)}
        onMouseDown={onRectMousedown}
        x1={x1}
        x2={x2}
        y1={y1}
        y2={y2}
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
