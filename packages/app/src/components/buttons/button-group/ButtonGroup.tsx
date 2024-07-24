import { ReactElement, useCallback, cloneElement, useState } from 'react';
import clsx from 'clsx';
import style from './ButtonGroup.module.scss';

interface Props {
  activeIndex?: number;
  children: Array<ReactElement>;
}

const QueueButtonGroup = ({ children, activeIndex }: Props) => {
  // 추후에 prop에 active를 판별하기위해서 인덱스가 아닌 id로 받을 수 있도록 할지 고민 현재는 id를 잘 넘기지 않는 편
  const [currentActiveIndex, setCurrentActiveIndex] = useState<number | null>(
    activeIndex ? activeIndex : null,
  );

  const clones = useCallback(
    () =>
      children.map((child, index) => {
        return cloneElement(
          child,
          {
            ...child.props,
            key: index,
            style: {
              borderRadius:
                index !== 0 && children.length - 1 !== index
                  ? '0px'
                  : !index
                    ? '8px 0 0 8px'
                    : children.length - 1 === index
                      ? '0 8px 8px 0'
                      : child.props.style,
              ...child.props.style,
            },
            index,
            'data-state': currentActiveIndex === index && 'on',
            onClick: () => {
              setCurrentActiveIndex(index);
              child.props.onClick();
            },
          },
          <>
            {child.props.children}
            {children.length - 1 !== index ? (
              <div className={clsx(style.divider)}></div>
            ) : (
              <></>
            )}
          </>,
        );
      }),
    [children, currentActiveIndex],
  );

  return (
    <>
      <div className={clsx('tw-flex')}>{clones()}</div>
    </>
  );
};

export default QueueButtonGroup;
