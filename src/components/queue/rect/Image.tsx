import clsx from 'clsx';
import { useContext } from 'react';
import { QueueObjectContainerContext } from '../Container';
import { QueueAnimatableContext } from '../QueueAnimation';
import { RectProps } from '../Rect';

export const Image = ({ onRectMousedown }: RectProps) => {
  const containerContext = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);
  const strokeClipPathID = `stroke-alignment-inner-for-image-${containerContext.object.id}`;

  const handleImageLoad = () => {
    // 메모리 해제를 위해서 revokeObjectURL을 사용한다.
    // 단, 메모리 해제 후에는 해당 URL을 다시 사용할 수 없는 문제가 있음(객체 복붙 했을 때 엑박..) -> 해결 필요
    URL.revokeObjectURL(containerContext.object.image.src);
  };

  return (
    <svg
      className={clsx('object-rect', 'absolute')}
      width={Math.abs(animation.rect.width)}
      height={Math.abs(animation.rect.height)}
      style={{
        top: `${animation.rect.height > 0 ? animation.rect.y : animation.rect.y + animation.rect.height}px`,
        left: `${animation.rect.width > 0 ? animation.rect.x : animation.rect.x + animation.rect.width}px`,
        transformOrigin: 'center center',
        transform: `rotate(${animation.rotate.degree}deg) scale(${animation.scale.scale})`,
      }}
      viewBox={`0 0 ${Math.abs(animation.rect.width)} ${Math.abs(animation.rect.height)}`}
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
        <image
          onLoad={handleImageLoad}
          onMouseDown={onRectMousedown}
          href={containerContext.object.image.src}
          width={Math.abs(animation.rect.width)}
          height={Math.abs(animation.rect.height)}
          stroke={containerContext.object.stroke.color}
          strokeWidth={containerContext.object.stroke.width * 2}
          strokeDasharray={containerContext.object.stroke.dasharray}
          clipPath={`url(#${strokeClipPathID})`}></image>
      </g>
    </svg>
  );
};
