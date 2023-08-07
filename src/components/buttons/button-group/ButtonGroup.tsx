import React, { ReactElement, useCallback, cloneElement, useState } from 'react';
import clsx from 'clsx';
import style from './ButtonGroup.module.scss';

interface Props {
  activeIndex?: number;
  children: Array<ReactElement>;
}

const QueueButtonGroup = ({ children, activeIndex }: Props) => {
  const [currentActiveIndex, setCurrentActiveIndex] = useState<number | null>(activeIndex ? activeIndex : null);

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
            onClick: () => setCurrentActiveIndex(index),
          },
          <>
            {child.props.children}
            {children.length - 1 !== index ? <div className={clsx(style.divider)}></div> : <></>}
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
