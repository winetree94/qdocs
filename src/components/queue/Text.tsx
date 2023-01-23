import clsx from 'clsx';
import { FunctionComponent, useContext } from 'react';
import { QueueObjectContainerContext } from './Container';
import { QueueAnimatableContext } from './QueueAnimation';

export const Text: FunctionComponent = () => {
  const animation = useContext(QueueAnimatableContext);
  const { object, transform } = useContext(QueueObjectContainerContext);
  return (
    <div
      className={clsx('object-text', 'flex', 'absolute')}
      style={{
        justifyContent: object.text.verticalAlign,
        alignItems: object.text.horizontalAlign,
        fontFamily: object.text.fontFamily,
        color: object.text.fontColor,
        fontSize: object.text.fontSize,
        top: `${animation.rect.y + transform.y}px`,
        left: `${animation.rect.x + transform.x}px`,
        width: `${animation.rect.width + transform.width}px`,
        height: `${animation.rect.height + transform.height}px`,
      }}
    >
      {object.text.text}
    </div>
  );
};