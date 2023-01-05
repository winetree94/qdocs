import { css } from '@emotion/css';
import { FunctionComponent } from 'react';
import classes from './RightPanel.module.scss';

export const RightPanel: FunctionComponent = () => {
  return (
    <div
      className={css`
        width: 200px;
        border-left: 1px solid rgba(0, 0, 0, 0.1);
      `}
    >
      right panel
      <button className="mb-2 py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-500 hover:bg-green-600">
        Hello, Tailwind CSS!
      </button>
      <button className={classes['module-scss']}>Hello, Module scss</button>
    </div>
  );
};
