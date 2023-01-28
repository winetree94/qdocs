import clsx from 'clsx';
import { convertHex } from 'components/queue/color/convertHex';
import { FunctionComponent, useContext } from 'react';
import { QueueObjectContainerContext } from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';
import { RectProps } from '../Rect';
import styles from './Square.module.scss';

export const Square: FunctionComponent<RectProps> = ({ onRectMousedown }) => {
  const containerContext = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);
  const strokeClipPathID = `stroke-alignment-inner-for-rect-${containerContext.object.uuid}`;
  const fill = convertHex(
    containerContext.object.fill.color,
    containerContext.object.fill.opacity
  );

  return (
    <svg
      className={clsx('object-rect', 'absolute')}
      width={animation.rect.width + containerContext.transform.width}
      height={animation.rect.height + containerContext.transform.height}
      style={{
        top: `${animation.rect.y + containerContext.transform.y}px`,
        left: `${animation.rect.x + containerContext.transform.x}px`,
        transformOrigin: 'center center',
        transform: `rotate(${
          animation.rotate.degree + containerContext.transformRotate.degree
        }deg)`,
      }}
      viewBox={`0 0 ${
        animation.rect.width + containerContext.transform.width
      } ${animation.rect.height + containerContext.transform.height}`}
      opacity={containerContext.object.fade.opacity}
    >
      <defs>
        <clipPath id={strokeClipPathID}>
          <rect
            rx={0}
            ry={0}
            width={animation.rect.width + containerContext.transform.width}
            height={animation.rect.height + containerContext.transform.height}
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
          width={animation.rect.width + containerContext.transform.width}
          height={animation.rect.height + containerContext.transform.height}
          fill={fill}
          stroke={containerContext.object.stroke.color}
          strokeWidth={containerContext.object.stroke.width * 2}
          strokeDasharray={containerContext.object.stroke.dasharray}
          clipPath={`url(#${strokeClipPathID})`}
        ></rect>
      </g>
    </svg>
  );
};
