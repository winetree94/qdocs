import { FunctionComponent, ReactNode, useRef } from 'react';

export interface DragProps {
  children: ReactNode;
  className?: string;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragMove?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
}

export const Drag: FunctionComponent<DragProps> = ({ children, className }) => {
  const container = useRef<HTMLDivElement>(null);

  const onMouseDown = (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ): void => {
    const mover = (event: MouseEvent): void => {
      console.log('mover');
    };

    const finish = (event: MouseEvent): void => {
      console.log('finish');
      container.current?.removeEventListener('mouseleave', finish);
      container.current?.removeEventListener('mouseup', finish);
      container.current?.removeEventListener('mousemove', mover);
    };
    container.current?.addEventListener('mouseleave', finish, { once: true });
    container.current?.addEventListener('mouseup', finish, {
      once: true,
    });
  };

  return (
    <div className={className} ref={container} onMouseDown={onMouseDown}>
      {children}
    </div>
  );
};
