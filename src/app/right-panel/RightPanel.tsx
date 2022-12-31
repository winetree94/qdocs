import { css } from '@emotion/css';
import { FunctionComponent } from 'react';

export const RightPanel: FunctionComponent = () => {
  return (
    <div
      className={css`
        width: 200px;
        border-left: 1px solid rgba(0, 0, 0, 0.1);
      `}
    >
      right panel
    </div>
  );
};
