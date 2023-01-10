/* eslint-disable @typescript-eslint/no-unused-vars */
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { FunctionComponent, MouseEvent, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Drawable, DrawEvent } from '../../cdk/draw/Draw';
import { QueueObject } from '../../components/queue/Object';
import {
  documentState,
  currentQueueObjectsSelector,
  queueObjectsByQueueIndexSelector,
} from '../../store/document';
import { documentSettingsState } from '../../store/settings';

const Selector = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid gray;
  background-color: rgba(0, 0, 0, 0.2);
`;

export const Content: FunctionComponent = () => {
  const objects = useRecoilValue(currentQueueObjectsSelector);
  const canvasDiv = useRef<HTMLDivElement>(null);
  const [document] = useRecoilState(documentState);
  const [settings, setSettings] = useRecoilState(documentSettingsState);

  const onMousedown = (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ): void => {
    // console.log(event);
  };

  const onDrawEnd = (event: DrawEvent): void => {
    if (!canvasDiv.current) {
      return;
    }

    const rect = canvasDiv.current.getBoundingClientRect();
    const scale = 1 / settings.scale;
    const x = (event.drawClientX - rect.x) * scale;
    const y = (event.drawClientY - rect.y) * scale;
    const width = event.width * scale;
    const height = event.height * scale;
    const selectedObjects = objects.filter((object) => {
      const rect = object.rect;
      return (
        rect.x >= x &&
        rect.y >= y &&
        rect.x + rect.width <= x + width &&
        rect.y + rect.height <= y + height
      );
    });

    setSettings({
      ...settings,
      selectedObjects: selectedObjects.map((object) => object.uuid),
    });
  };

  return (
    <Drawable
      scale={settings.scale}
      drawer={<Selector></Selector>}
      onDrawEnd={(e): void => onDrawEnd(e)}
      className={css`
        flex: 1;
        background: #e9eaed;
        overflow: auto;
        display: flex;
      `}
    >
      <div
        style={{
          padding: '10px',
          margin: 'auto',
        }}
      >
        <div
          style={{
            width: document.documentRect.width * settings.scale,
            height: document.documentRect.height * settings.scale,
            background: 'white',
            flexShrink: 0,
          }}
        >
          <div
            className={css`
              transform-origin: 0 0;
              transform: scale(${settings.scale});
            `}
          >
            <div
              ref={canvasDiv}
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
              {objects.map((object) => (
                <QueueObject
                  key={object.uuid}
                  position={settings.queuePosition}
                  index={settings.queueIndex}
                  selected={settings.selectedObjects.includes(object.uuid)}
                  object={object}
                ></QueueObject>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Drawable>
  );
};
