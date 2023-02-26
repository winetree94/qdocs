import styles from './Draw.module.scss';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export interface DrawEvent {
  x: number;
  y: number;
  clientX: number;
  clientY: number;
  width: number;
  height: number;
}

export interface DrawProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  threshold?: number;
  onDrawStart?: (event: DrawEvent) => void;
  onDrawMove?: (event: DrawEvent) => void;
  onDrawEnd?: (event: DrawEvent) => void;
}

interface ThrosholdDetectorProps {
  startClientX: number;
  startClientY: number;
  threshold: number;
  onThreshold: () => void;
  onMouseup: () => void;
}

const ThresholdDetector = ({
  startClientX,
  startClientY,
  threshold,
  onThreshold,
  onMouseup,
}: ThrosholdDetectorProps) => {
  useLayoutEffect(() => {
    const moveListener = (event: MouseEvent) => {
      const startX = startClientX;
      const startY = startClientY;
      const targetX = event.clientX;
      const targetY = event.clientY;
      const isChanged = Math.abs(startX - targetX) > threshold || Math.abs(startY - targetY) > threshold;
      if (!isChanged) {
        return;
      }
      onThreshold();
    };
    const upListener = () => {
      document.removeEventListener('mousemove', moveListener);
      document.removeEventListener('mouseup', upListener);
      onMouseup();
    };
    document.addEventListener('mousemove', moveListener);
    document.addEventListener('mouseup', upListener);
    return () => {
      document.removeEventListener('mousemove', moveListener);
      document.removeEventListener('mouseup', upListener);
    };
  }, [startClientX, startClientY, threshold, onThreshold, onMouseup]);
  return <></>;
};

interface DrawDetectorProps {
  onMousemove: (event: MouseEvent) => void;
  onMouseup: (event: MouseEvent) => void;
}

const DrawDetector = ({ onMousemove, onMouseup }: DrawDetectorProps) => {
  useEffect(() => {
    const moveListener = (event: MouseEvent) => {
      onMousemove(event);
    };
    const upListener = (event: MouseEvent) => {
      onMouseup(event);
      document.removeEventListener('mousemove', moveListener);
      document.removeEventListener('mouseup', upListener);
    };
    document.addEventListener('mousemove', moveListener);
    document.addEventListener('mouseup', upListener);
    return () => {
      document.removeEventListener('mousemove', moveListener);
      document.removeEventListener('mouseup', upListener);
    };
  }, [onMousemove, onMouseup]);
  return <></>;
};

export const Drawable = ({ threshold = 30, onDrawStart, onDrawMove, onDrawEnd, children, ...divProps }: DrawProps) => {
  const container = useRef<HTMLDivElement>(null);

  const [initMouseEvent, setInitMouseEvent] = useState<MouseEvent>(null);
  const [detectMouseEvent, setDetectMouseEvent] = useState<MouseEvent>(null);

  const [position, setPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const getPos = (event: MouseEvent): DrawEvent => {
    const containerRect = container.current.getBoundingClientRect();
    const initClientX = detectMouseEvent.clientX;
    const initClientY = detectMouseEvent.clientY;
    const initOffsetX = detectMouseEvent.clientX - containerRect.x;
    const initOffsetY = detectMouseEvent.clientY - containerRect.y;
    const movedX = event.clientX - containerRect.x - initOffsetX;
    const movedY = event.clientY - containerRect.y - initOffsetY;
    const startClientX = movedX >= 0 ? initClientX : initClientX + movedX;
    const startClientY = movedY >= 0 ? initClientY : initClientY + movedY;
    const startOffsetX = movedX >= 0 ? initOffsetX : initOffsetX + movedX;
    const startOfssetY = movedY >= 0 ? initOffsetY : initOffsetY + movedY;
    const width = Math.abs(movedX);
    const height = Math.abs(movedY);

    return {
      x: startOffsetX,
      y: startOfssetY,
      clientX: startClientX,
      clientY: startClientY,
      width: width,
      height: height,
    };
  };

  const drawMove = (event: MouseEvent) => {
    const pos = getPos(event);
    setPosition(pos);
    onDrawMove?.(pos);
  };

  const drawEnd = (event: MouseEvent) => {
    const pos = getPos(event);
    setPosition(null);
    setDetectMouseEvent(null);
    setInitMouseEvent(null);
    onDrawEnd?.(pos);
  };

  return (
    <>
      <div
        {...divProps}
        className={clsx(styles.Drawer, divProps.className)}
        ref={container}
        onMouseDown={(e) => setInitMouseEvent(e.nativeEvent)}>
        {children}
        {position && (
          <div
            className={styles.Draw}
            style={{
              top: position.y,
              left: position.x,
              width: position.width,
              height: position.height,
            }}>
            <div className={clsx(styles.Preview, 'w-full', 'h-full')}></div>
          </div>
        )}
      </div>
      {initMouseEvent && (
        <ThresholdDetector
          startClientX={initMouseEvent.clientX}
          startClientY={initMouseEvent.clientY}
          threshold={threshold}
          onThreshold={() => {
            setDetectMouseEvent(initMouseEvent);
            setInitMouseEvent(null);
          }}
          onMouseup={() => {
            setDetectMouseEvent(null);
            setInitMouseEvent(null);
          }}
        />
      )}
      {detectMouseEvent && <DrawDetector onMousemove={drawMove} onMouseup={drawEnd} />}
    </>
  );
};
