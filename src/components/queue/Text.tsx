import clsx from 'clsx';
import { FunctionComponent, useContext, useEffect, useRef } from 'react';
import { QueueObjectContainerContext } from './Container';
import { QueueAnimatableContext } from './QueueAnimation';
import styles from './Text.module.scss';

export interface TextProps {
  onEdit?(text: string): void;
}

export const Text: FunctionComponent<TextProps> = ({ onEdit }) => {
  const ref = useRef<HTMLDivElement>(null);
  const animation = useContext(QueueAnimatableContext);
  const { object, detail } = useContext(QueueObjectContainerContext);

  const verticalAlign =
    object.text.verticalAlign === 'middle' ? 'center' : object.text.verticalAlign === 'top' ? 'flex-start' : 'flex-end';

  const textAlign =
    object.text.horizontalAlign === 'center' ? 'center' : object.text.horizontalAlign === 'left' ? 'left' : 'right';

  const onKeydown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.nativeEvent.isComposing) {
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      // 완벽한 대안을 못찾겠음
      document.execCommand('insertLineBreak');
    }
  };

  const onBlur = (): void => {
    onEdit?.(ref.current.innerHTML);
  };

  const onTextInput = (): void => {
    onEdit?.(ref.current.innerHTML);
  };

  useEffect(() => {
    ref.current!.innerHTML = object.text.text;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focus = () => {
    const selection = window.getSelection();
    const newRange = document.createRange();
    newRange.selectNodeContents(ref.current!);
    newRange.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(newRange);
  };

  useEffect(() => {
    if (!detail) {
      return;
    }
    focus();
  }, [detail]);

  return (
    <div
      className={clsx(styles.Container, detail ? styles.Enable : '')}
      onMouseDown={(e): void => {
        if (!detail) {
          return;
        }
        e.stopPropagation();
        e.preventDefault();
        focus();
      }}
      style={{
        alignItems: verticalAlign,
        fontFamily: object.text.fontFamily,
        top: `${animation.rect.y}px`,
        left: `${animation.rect.x}px`,
        width: `${animation.rect.width}px`,
        height: `${animation.rect.height}px`,
        transformOrigin: 'center center',
        transform: `rotate(${animation.rotate.degree}deg) scale(${animation.scale.scale})`,
        opacity: `${animation.fade.opacity}`,
      }}
      data-enables-text-edit={detail}>
      <div
        ref={ref}
        className={clsx(styles.Editor, detail ? styles.Enable : '')}
        onKeyDown={onKeydown}
        onBlur={onBlur}
        suppressContentEditableWarning={true}
        onInput={(): void => onTextInput()}
        style={{
          textAlign: textAlign,
          fontFamily: object.text.fontFamily,
          color: object.text.fontColor,
          fontSize: object.text.fontSize,
        }}
        spellCheck="false"
        contentEditable={detail}
        onMouseDown={(e): void => detail && e.stopPropagation()}></div>
    </div>
  );
};
