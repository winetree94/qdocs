import { css } from '@emotion/css';
import { FunctionComponent } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { documentState } from '../../store/document';
import { documentSettingsState } from '../../store/settings';

export const Content: FunctionComponent = () => {
  const [document] = useRecoilState(documentState);
  const settings = useRecoilValue(documentSettingsState);
  return (
    <div
      className={css`
        flex: 1;
        background: #e9eaed;
        overflow: auto;
      `}
    >
      <div
        className={css`
          transform-origin: 0 0;
        `}
        style={{
          transform: `scale(${settings.scale})`,
        }}
      >
        <div
          className={css`
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          `}
          style={{
            width: document.documentRect.width * 2,
            height: document.documentRect.height * 2,
          }}
        >
          <div
            className={css`
              border: 1px solid gray;
              background: white;
              position: absolute;
            `}
            style={{
              width: document.documentRect.width,
              height: document.documentRect.height,
            }}
          ></div>
          <svg
            width={document.documentRect.width * 2}
            height={document.documentRect.height * 2}
          >
            <g>
              <rect width={200} height={200} x={0} y={0} stroke="black"></rect>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
