/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useContext, useEffect } from 'react';
import { QueueAnimatableContext } from './QueueAnimation';

export interface DraggableProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  onMousedown?: (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => void;
  onDraggingStart?: (initEvent: MouseEvent, event: MouseEvent) => void;
  onDraggingMove?: (initEvent: MouseEvent, event: MouseEvent) => void;
  onDraggingEnd?: (initEvent: MouseEvent, event: MouseEvent) => void;
}

export const Draggable: React.FunctionComponent<DraggableProps> = ({
  children,
  onMousedown,
  onDraggingStart,
  onDraggingMove,
  onDraggingEnd,
  ...divProps
}) => {
  const meta = useContext(QueueAnimatableContext);
  const [initMousedownEvent, setInitMousedownEvent] =
    React.useState<MouseEvent | null>(null);

  const onDocumentMousemove = useCallback(
    (event: MouseEvent) => {
      if (onDraggingMove) {
        onDraggingMove(initMousedownEvent!, event);
      }
    },
    [initMousedownEvent, onDraggingMove]
  );

  const onDocumentMouseup = useCallback(
    (event: MouseEvent) => {
      if (onDraggingEnd) {
        onDraggingEnd(initMousedownEvent!, event);
      }
      setInitMousedownEvent(null);
    },
    [initMousedownEvent, onDraggingEnd]
  );

  useEffect(() => {
    if (!initMousedownEvent) {
      return;
    }
    document.addEventListener('mousemove', onDocumentMousemove);
    document.addEventListener('mouseup', onDocumentMouseup);
    return () => {
      document.removeEventListener('mousemove', onDocumentMousemove);
      document.removeEventListener('mouseup', onDocumentMouseup);
    };
  }, [initMousedownEvent, onDocumentMousemove, onDocumentMouseup]);

  const onContainerMousedown = useCallback(
    (
      initEvent: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
    ): void => {
      if (onMousedown) {
        onMousedown(initEvent);
      }
      if (onDraggingStart) {
        onDraggingStart(initEvent.nativeEvent, initEvent.nativeEvent);
      }
      setInitMousedownEvent(initEvent.nativeEvent);
    },
    [onMousedown, onDraggingStart]
  );

  return (
    <div
      {...divProps}
      onMouseDown={onContainerMousedown}
      style={{
        transform: `scale(${meta.scale.scale}) rotate(${meta.rotate.degree || 0}deg)`,
        transformOrigin: `${meta.rect.x + (meta.rect.width / 2)}px ${meta.rect.y + (meta.rect.height / 2)}px`,
      }}>
      {children}
    </div>
  );
};
