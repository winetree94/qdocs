/* eslint-disable @typescript-eslint/no-unused-vars */
import { css } from '@emotion/css';
import { FunctionComponent, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { documentState } from '../../store/document';
import { documentSettingsState } from '../../store/settings';

export const Content: FunctionComponent = () => {
  const [document] = useRecoilState(documentState);
  const settings = useRecoilValue(documentSettingsState);

  useEffect(() => {
    console.log(settings.scale);
  }, [settings]);

  return (
    <div
      className={css`
        flex: 1;
        background: #e9eaed;
        overflow: auto;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <div
        style={{
          width: document.documentRect.width * settings.scale,
          height: document.documentRect.height * settings.scale,
        }}
      >
        <div
          className={css`
            transform-origin: 0 0;
            transform: scale(${settings.scale});
          `}
        >
          <div
            className={css`
              position: relative;
              border: 1px solid gray;
              box-sizing: border-box;
              background: white;
            `}
            style={{
              width: document.documentRect.width,
              height: document.documentRect.height,
            }}
          >
            <div
              className={css`
                position: absolute;
                top: -200px;
                left: -200px;
              `}
            >
              hello world!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
