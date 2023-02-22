import React, { useCallback, useContext, useEffect, useState } from 'react';
import { QueueObjectContainerContext } from './Container';

export interface DraggableProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  onMousedown?: (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
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
  const { detail } = useContext(QueueObjectContainerContext);
  const [initMousedownEvent, setInitMousedownEvent] = useState<MouseEvent | null>(null);

  const onDocumentMousemove = useCallback(
    (event: MouseEvent) => {
      if (onDraggingMove) {
        onDraggingMove(initMousedownEvent!, event);
      }
    },
    [initMousedownEvent, onDraggingMove],
  );

  const onDocumentMouseup = useCallback(
    (event: MouseEvent) => {
      if (onDraggingEnd) {
        onDraggingEnd(initMousedownEvent!, event);
      }
      setInitMousedownEvent(null);
    },
    [initMousedownEvent, onDraggingEnd],
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
    (initEvent: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>): void => {
      if (onMousedown) {
        onMousedown(initEvent);
      }
      if (detail || initEvent.button !== 0) {
        return;
      }
      if (onDraggingStart) {
        onDraggingStart(initEvent.nativeEvent, initEvent.nativeEvent);
      }
      setInitMousedownEvent(initEvent.nativeEvent);
    },
    [onMousedown, onDraggingStart, detail],
  );

  return (
    <div
      {...divProps}
      onMouseDown={onContainerMousedown}
      style={{
        ...(divProps.style || {}),
      }}>
      {children}
    </div>
  );
};
