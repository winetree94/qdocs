import { css } from '@emotion/css';
import { FunctionComponent } from 'react';

export const Content: FunctionComponent = () => {
  return (
    <div
      className={css`
        flex: 1 1 auto;
        background: #e9eaed;
      `}
    >
      content
    </div>
  );
};
