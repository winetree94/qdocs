import { QueueRect } from 'model/object/rect';
import { FunctionComponent, ReactNode } from 'react';

export interface RectProps {
  rect: QueueRect;
  children: ReactNode;
}

export const Rect: FunctionComponent<RectProps> = ({
  children,
  rect,
}) => {

  return (
    <div></div>
    // <Animatable>
    //   <svg
    //     className="object-rect"
    //     ref={objectRef}
    //     width={currentRect.width + translate.width}
    //     height={currentRect.height + translate.height}
    //   >
    //     <g>
    //       <rect
    //         x={0}
    //         y={0}
    //         width={currentRect.width + translate.width}
    //         height={currentRect.height + translate.height}
    //         fill={currentFill.color}
    //         stroke={currentStroke.color}
    //         strokeWidth={currentStroke.width}
    //         strokeDasharray={currentStroke.dasharray}
    //       ></rect>
    //     </g>
    //   </svg>
    // </Animatable>
  );
};