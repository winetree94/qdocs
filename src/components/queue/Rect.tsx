import { FunctionComponent, useContext } from 'react';
import { QueueObjectContainerContext } from './Container';
import { Circle } from './rect/Circle';
import { Square } from './rect/Square';

export const Rect: FunctionComponent = () => {
  const containerContext = useContext(QueueObjectContainerContext);

  switch (containerContext.object.type) {
    case 'circle':
      return <Circle></Circle>;
    case 'rect':
      return <Square></Square>;
  }
};