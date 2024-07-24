import symbolPath from '@legacy/assets/remixicon.symbol.svg';
import { convertHexWithOpacity } from '@legacy/components/queue/color/convertHex';
import { StandaloneIconObject } from '@legacy/model/standalone-object';

export const StandaloneIcon = ({
  rect,
  rotate,
  fade,
  scale,
  fill,
  iconType,
}: StandaloneIconObject) => {
  const calculatedFill = convertHexWithOpacity(
    fill.color,
    fill.opacity * fade.opacity * fill.opacity,
  );

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
      opacity={fade.opacity}>
      <use href={`${symbolPath}#${iconType}`} fill={calculatedFill}></use>
    </svg>
  );
};
