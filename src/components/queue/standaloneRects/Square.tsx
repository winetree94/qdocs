import { EntityId } from '@reduxjs/toolkit';
import { convertHexWithOpacity } from 'components/queue/color/convertHex';

export interface StandaloneSquareProps {
  objectId: EntityId;
  width: number;
  height: number;
  position: any;
  stroke: any;
  rotate: any;
  fade: any;
  scale: any;
  fill: any;
}

export const StandaloneSquare = ({
  objectId,
  width,
  height,
  position,
  stroke,
  rotate,
  fade,
  scale,
  fill,
}: StandaloneSquareProps) => {
  const strokeClipPathID = `st-stroke-alignment-inner-for-rect-${objectId}`;
  const calculatedFill = convertHexWithOpacity(fill.color, fill.opacity * fade.opacity * fill.opacity);

  return (
    <svg
      width={width}
      height={height}
      style={{
        top: `${height > 0 ? position.y : position.y + height}px`,
        left: `${width > 0 ? position.x : position.x + width}px`,
        transformOrigin: 'center center',
        transform: `rotate(${rotate.degree}deg) scale(${scale.scale})`,
      }}
      viewBox={`0 0 ${width} ${height}`}
      opacity={fade.opacity}>
      <defs>
        <clipPath id={strokeClipPathID}>
          <rect rx={0} ry={0} width={width} height={height} stroke={stroke.color} strokeWidth={stroke.width * 2} />
        </clipPath>
      </defs>
      <g>
        <rect
          width={width}
          height={height}
          fill={calculatedFill}
          stroke={stroke.color}
          strokeWidth={stroke.width * 2}
          strokeDasharray={stroke.dasharray}
          clipPath={`url(#${strokeClipPathID})`}></rect>
      </g>
    </svg>
  );
};
