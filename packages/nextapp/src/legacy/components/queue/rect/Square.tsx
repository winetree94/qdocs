import clsx from 'clsx';
import { convertHexWithOpacity } from '@legacy/components/queue/color/convertHex';
import { useContext } from 'react';
import { QueueObjectContainerContext } from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';
import { RectProps } from '../Rect';
import styles from './Square.module.scss';

export const Square = ({ onRectMousedown }: RectProps) => {
  const containerContext = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const strokeClipPathID = `stroke-alignment-inner-for-rect-${containerContext.object.id}`;
  const fill = convertHexWithOpacity(
    animation.fill.color,
    containerContext.object.fill.opacity *
      animation.fade.opacity *
      animation.fill.opacity,
  );

  return (
    <svg
      className={clsx('object-rect', 'tw-absolute')}
      width={Math.abs(animation.rect.width)}
      height={Math.abs(animation.rect.height)}
      style={{
        top: `${
          animation.rect.height > 0
            ? animation.rect.y
            : animation.rect.y + animation.rect.height
        }px`,
        left: `${
          animation.rect.width > 0
            ? animation.rect.x
            : animation.rect.x + animation.rect.width
        }px`,
        transformOrigin: 'center center',
        transform: `rotate(${animation.rotate.degree}deg) scale(${animation.scale.scale})`,
      }}
      viewBox={`0 0 ${Math.abs(animation.rect.width)} ${Math.abs(
        animation.rect.height,
      )}`}
      opacity={animation.fade.opacity}>
      <defs>
        <clipPath id={strokeClipPathID}>
          <rect
            rx={0}
            ry={0}
            width={Math.abs(animation.rect.width)}
            height={Math.abs(animation.rect.height)}
            stroke={containerContext.object.stroke.color}
            strokeWidth={containerContext.object.stroke.width * 2}
          />
        </clipPath>
      </defs>
      <g>
        <rect
          className={clsx(styles.rect)}
          onMouseDown={onRectMousedown}
          width={Math.abs(animation.rect.width)}
          height={Math.abs(animation.rect.height)}
          fill={fill}
          stroke={containerContext.object.stroke.color}
          strokeWidth={containerContext.object.stroke.width * 2}
          strokeDasharray={containerContext.object.stroke.dasharray}
          clipPath={`url(#${strokeClipPathID})`}></rect>
      </g>
    </svg>
  );
};
