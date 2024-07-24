import { convertHexWithOpacity } from '@legacy/components/queue/color/convertHex';
import { StandaloneLineObject } from '@legacy/model/standalone-object';

export const StandaloneLine = ({
  objectId,
  rect,
  stroke,
  rotate,
  fade,
  scale,
  fill,
}: StandaloneLineObject) => {
  const strokeClipPathID = `st-stroke-alignment-inner-for-rect-${objectId}`;
  const calculatedFill = convertHexWithOpacity(
    fill.color,
    fill.opacity * fade.opacity * fill.opacity,
  );

  const x1 = 0;
  const x2 = x1 + rect.width;
  const y1 = 0;
  const y2 = y1 + rect.height;

  return (
    <svg
      className="tw-absolute"
      width={Math.abs(rect.width)}
      height={Math.abs(rect.height)}
      style={{
        top: `${rect.height > 0 ? rect.y : rect.y + rect.height}px`,
        left: `${rect.width > 0 ? rect.x : rect.x + rect.width}px`,
        transformOrigin: 'center center',
        transform: `rotate(${rotate.degree}deg) scale(${scale.scale})`,
      }}
      viewBox={`0 0 ${Math.abs(rect.width)} ${Math.abs(rect.height)}`}
      opacity={fade.opacity}>
      <line
        x1={rect.width > 0 ? x1 : x1 - rect.width}
        x2={rect.width > 0 ? x2 : 0}
        y1={rect.height > 0 ? y1 : y1 - rect.height}
        y2={rect.height > 0 ? y2 : 0}
        fill={calculatedFill}
        opacity={fade.opacity}
        stroke={stroke.color}
        strokeWidth={stroke.width * 2}
        strokeDasharray={stroke.dasharray}
        clipPath={`url(#${strokeClipPathID})`}
      />
    </svg>
  );
};
