import clsx from 'clsx';
import { FunctionComponent, useContext } from 'react';
import { QueueObjectContainerContext } from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';
import { RectProps } from '../Rect';
import styles from './Circle.module.scss';

export const Circle: FunctionComponent<RectProps> = ({ onRectMousedown }) => {
  const containerContext = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);

  const rx = (animation.rect.width + containerContext.transform.width) / 2;
  const ry = (animation.rect.height + containerContext.transform.height) / 2;
  const strokeClipPathID = `stroke-alignment-inner-for-circle-${containerContext.object.uuid}`;

  return (
    <svg
      className={clsx('object-circle', 'absolute')}
      width={animation.rect.width + containerContext.transform.width}
      height={animation.rect.height + containerContext.transform.height}
      style={{
        top: `${animation.rect.y + containerContext.transform.y}px`,
        left: `${animation.rect.x + containerContext.transform.x}px`,
      }}
    >
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
          onMouseDown={onRectMousedown}
          className={clsx(styles.circle)}
          cx={rx}
          cy={ry}
          rx={rx}
          ry={ry}
          stroke={containerContext.object.stroke.color}
          strokeWidth={containerContext.object.stroke.width * 2}
          strokeDasharray={containerContext.object.stroke.dasharray}
          fill={containerContext.object.fill.color}
          clipPath={`url(#${strokeClipPathID})`}
        />
      </g>
    </svg>
  );
};
