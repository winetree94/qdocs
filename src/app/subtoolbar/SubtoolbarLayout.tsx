import { css } from '@emotion/css';
import { FunctionComponent } from 'react';
import { useRecoilState } from 'recoil';
import { Button } from '../../components/button/Button';
import { documentSettingsState } from '../../store/settings';

const SubtoolbarButtonStyle = css`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SubtoolbarLayout: FunctionComponent = () => {
  const [settings, setSettings] = useRecoilState(documentSettingsState);

  const increaseScale = (): void => {
    setSettings({
      ...settings,
      scale: settings.scale + 0.1,
    });
  };

  const decreaseScale = (): void => {
    setSettings({
      ...settings,
      scale: Math.max(settings.scale - 0.1, 0.1),
    });
  };

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
        <Button className={SubtoolbarButtonStyle} onClick={decreaseScale}>
          <i className="ri-subtract-line" />
        </Button>
        <Button className={SubtoolbarButtonStyle} onClick={increaseScale}>
          <i className="ri-add-line" />
        </Button>
      </div>
    </div>
  );
};
