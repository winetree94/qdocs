import clsx from 'clsx';
import { convertHex } from 'components/queue/color/convertHex';
import { FunctionComponent, useContext } from 'react';
import { QueueObjectContainerContext } from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';
import { RectProps } from '../Rect';
import styles from './Circle.module.scss';

export const Circle: FunctionComponent<RectProps> = ({ onRectMousedown }) => {
  const containerContext = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);

  const rx = animation.rect.width / 2;
  const ry = animation.rect.height / 2;
  const strokeClipPathID = `stroke-alignment-inner-for-circle-${containerContext.object.uuid}`;
  const fill = convertHex(
    containerContext.object.fill.color,
    containerContext.object.fill.opacity
  );

  return (
    <svg
      className={clsx('object-circle', 'absolute')}
      width={animation.rect.width}
      height={animation.rect.height}
      style={{
        top: `${animation.rect.y}px`,
        left: `${animation.rect.x}px`,
        transformOrigin: 'center center',
        transform: `rotate(${animation.rotate.degree}deg)`,
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
