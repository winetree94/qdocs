import { StandaloneImageObject } from '@legacy/model/standalone-object';

export const StandaloneImage = ({
  objectId,
  rect,
  stroke,
  rotate,
  fade,
  scale,
  image,
}: StandaloneImageObject) => {
  const strokeClipPathID = `st-stroke-alignment-inner-for-image-${objectId}`;

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
      <defs>
        <clipPath id={strokeClipPathID}>
          <rect
            rx={0}
            ry={0}
            width={Math.abs(rect.width)}
            height={Math.abs(rect.height)}
            stroke={stroke.color}
            strokeWidth={stroke.width * 2}
          />
        </clipPath>
      </defs>
      <g>
        <image
          href={image.src}
          width={Math.abs(rect.width)}
          height={Math.abs(rect.height)}
          stroke={stroke.color}
          strokeWidth={stroke.width * 2}
          strokeDasharray={stroke.dasharray}
          clipPath={`url(#${strokeClipPathID})`}></image>
      </g>
    </svg>
  );
};
