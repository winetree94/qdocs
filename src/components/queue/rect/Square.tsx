import clsx from 'clsx';
import { convertHex } from 'components/queue/color/convertHex';
import { useContext } from 'react';
import { QueueObjectContainerContext } from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';
import { RectProps } from '../Rect';
import styles from './Square.module.scss';

export const Square = ({ onRectMousedown }: RectProps) => {
  const containerContext = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);
  const strokeClipPathID = `stroke-alignment-inner-for-rect-${containerContext.object.id}`;
  const fill = convertHex(
    containerContext.object.fill.color,
    containerContext.object.fill.opacity * animation.fade.opacity,
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
        transform: `rotate(${animation.rotate.degree}deg)`,
      }}
      viewBox={`0 0 ${animation.rect.width} ${animation.rect.height}`}
      opacity={animation.fade.opacity}>
      <defs>
        <clipPath id={strokeClipPathID}>
          <rect
            rx={0}
            ry={0}
            width={animation.rect.width}
            height={animation.rect.height}
            fill={fill}
            stroke={containerContext.object.stroke.color}
            strokeWidth={containerContext.object.stroke.width * 2}
          />
        </clipPath>
      </defs>
      <g>
        <rect
          className={clsx(styles.rect)}
          onMouseDown={onRectMousedown}
          width={animation.rect.width}
          height={animation.rect.height}
          fill={fill}
          stroke={containerContext.object.stroke.color}
          strokeWidth={containerContext.object.stroke.width * 2}
          strokeDasharray={containerContext.object.stroke.dasharray}
          clipPath={`url(#${strokeClipPathID})`}></rect>
      </g>
    </svg>
  );
};
