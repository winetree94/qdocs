import { EntityId } from '@reduxjs/toolkit';
import { convertHexWithOpacity } from 'components/queue/color/convertHex';
import type {
  QueueFade,
  QueueFill,
  QueueRect,
  QueueRotate,
  QueueScale,
  QueueStroke,
} from 'model/property';

export interface StandaloneCircleProps {
  objectId: EntityId;
  rect: QueueRect;
  stroke: QueueStroke;
  rotate: QueueRotate;
  fade: QueueFade;
  scale: QueueScale;
  fill: QueueFill;
}

export const StandaloneCircle = ({
  objectId,
  rect,
  stroke,
  rotate,
  fade,
  scale,
  fill,
}: StandaloneCircleProps) => {
  const strokeClipPathID = `st-stroke-alignment-inner-for-circle-${objectId}`;
  const rx = Math.abs(rect.width) / 2;
  const ry = Math.abs(rect.height) / 2;
  const calculatedFill = convertHexWithOpacity(
    fill.color,
    fill.opacity * fade.opacity * fill.opacity,
  );

  return (
    <svg
      className="object-circle tw-absolute"
      width={Math.abs(rect.width)}
      height={Math.abs(rect.height)}
      style={{
        top: `${rect.height > 0 ? rect.y : rect.y + rect.height}px`,
        left: `${rect.width > 0 ? rect.x : rect.x + rect.width}px`,
        transformOrigin: 'center center',
        transform: `rotate(${rotate.degree}deg) scale(${scale.scale})`,
      }}
      opacity={fade.opacity}>
      <defs>
        <clipPath id={strokeClipPathID}>
          <ellipse
            cx={rx}
            cy={ry}
            rx={rx}
            ry={ry}
            stroke={stroke.color}
            strokeWidth={stroke.width * 2}
          />
        </clipPath>
      </defs>
      <g>
        <ellipse
          cx={rx}
          cy={ry}
          rx={rx}
          ry={ry}
          stroke={stroke.color}
          strokeWidth={stroke.width * 2}
          strokeDasharray={stroke.dasharray}
          fill={calculatedFill}
          clipPath={`url(#${strokeClipPathID})`}
        />
      </g>
    </svg>
  );
};
