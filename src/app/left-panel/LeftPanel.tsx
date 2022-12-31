import { css } from '@emotion/css';
import { FunctionComponent } from 'react';

export const LeftPanel: FunctionComponent = () => {
  return (
    <div
      className={css`
        width: 200px;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
      `}
    >
      left panel
    </div>
  );
};
