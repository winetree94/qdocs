import clsx from 'clsx';
import { convertHexWithOpacity } from '@legacy/components/queue/color/convertHex';
import { useContext } from 'react';
import { QueueObjectContainerContext } from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';
import { RectProps } from '../Rect';
import styles from './Circle.module.scss';

export const Circle = ({ onRectMousedown }: RectProps) => {
  const containerContext = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);

  const rx = Math.abs(animation.rect.width) / 2;
  const ry = Math.abs(animation.rect.height) / 2;
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const strokeClipPathID = `stroke-alignment-inner-for-circle-${containerContext.object.id}`;
  const fill = convertHexWithOpacity(
    animation.fill.color,
    containerContext.object.fill.opacity *
      animation.fade.opacity *
      animation.fill.opacity,
  );

  return (
    <svg
      className={clsx('object-circle', 'tw-absolute')}
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
      opacity={animation.fade.opacity}>
      <defs>
        <clipPath id={strokeClipPathID}>
          <ellipse
            cx={rx}
            cy={ry}
            rx={rx}
            ry={ry}
            stroke={containerContext.object.stroke.color}
            strokeWidth={containerContext.object.stroke.width * 2}
          />
        </clipPath>
      </defs>
      <g>
        <ellipse
          className={clsx(styles.circle)}
          onMouseDown={onRectMousedown}
          cx={rx}
          cy={ry}
          rx={rx}
          ry={ry}
          stroke={containerContext.object.stroke.color}
          strokeWidth={containerContext.object.stroke.width * 2}
          strokeDasharray={containerContext.object.stroke.dasharray}
          fill={fill}
          clipPath={`url(#${strokeClipPathID})`}
        />
      </g>
    </svg>
  );
};
