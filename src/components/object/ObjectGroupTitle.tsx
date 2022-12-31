import { css } from '@emotion/css';
import { FunctionComponent, ReactNode, useContext } from 'react';
import { ObjectGroupContext } from './ObjectGroup';

const ArrowStyle = css`
  margin-left: 8px;
  margin-right: 8px;
`;

export const ObjectGroupTitle: FunctionComponent<{ children: ReactNode }> = (
  props
) => {
  const context = useContext(ObjectGroupContext);
  const { children } = props;
  return (
    <button
      className={css`
        padding: 0;
        height: 36px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background: none;
        border: none;
        outline: none;
        width: 100%;

        &:hover {
          background: #eee;
        }

        &:active {
          background: #ddd;
        }
      `}
      onClick={(): void => context.setOpened(!context.opened)}
    >
      {context.opened ? (
        <i className={ArrowStyle + ' ri-arrow-down-s-line'}></i>
      ) : (
        <i className={ArrowStyle + ' ri-arrow-right-s-line'}></i>
      )}
      {children}
    </button>
  );
};
