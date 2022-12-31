import { css } from '@emotion/css';
import { FunctionComponent } from 'react';
import { Button } from '../../components/button/Button';

const SubtoolbarButtonStyle = css`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SubtoolbarLayout: FunctionComponent = () => {
  return (
    <div
      className={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      `}
    >
      <div
        className={css`
          display: flex;
          height: 100%;
        `}
      >
        <Button className={SubtoolbarButtonStyle}>
          <i className="ri-arrow-go-back-line" />
        </Button>
        <Button className={SubtoolbarButtonStyle}>
          <i className="ri-arrow-go-forward-line" />
        </Button>
        <Button className={SubtoolbarButtonStyle}>
          <i className="ri-file-copy-line" />
        </Button>
        <Button className={SubtoolbarButtonStyle}>
          <i className="ri-clipboard-line" />
        </Button>
      </div>
      <div
        className={css`
          display: flex;
        `}
      >
        <Button className={SubtoolbarButtonStyle}>
          <i className="ri-arrow-left-line" />
        </Button>
        <Button className={SubtoolbarButtonStyle}>
          <i className="ri-arrow-right-line" />
        </Button>
      </div>
      <div
        className={css`
          display: flex;
        `}
      >
        <Button className={SubtoolbarButtonStyle}>
          <i className="ri-subtract-line" />
        </Button>
        <Button className={SubtoolbarButtonStyle}>
          <i className="ri-add-line" />
        </Button>
      </div>
    </div>
  );
};
