/* eslint-disable @typescript-eslint/no-unused-vars */
import { css } from '@emotion/css';
import { FunctionComponent, MouseEvent, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Drawable } from '../../cdk/draw/Draw';
import { documentState } from '../../store/document';
import { documentSettingsState } from '../../store/settings';

export const Content: FunctionComponent = () => {
  const [document] = useRecoilState(documentState);
  const settings = useRecoilValue(documentSettingsState);

  useEffect(() => {
    console.log(settings.scale);
  }, [settings]);

  const onMousedown = (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ): void => {
    console.log(event);
  };

  return (
    <Drawable
      scale={settings.scale}
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
            {document.objects.map((object) => (
              <div key={object.uuid}>d</div>
            ))}
          </div>
        </div>
      </div>
    </Drawable>
  );
};
