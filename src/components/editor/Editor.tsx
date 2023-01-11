/* eslint-disable @typescript-eslint/no-unused-vars */
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import {
  createContext,
  forwardRef,
  MouseEvent,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Drawable, DrawEvent } from '../../cdk/draw/Draw';
import { QueueObject } from '../queue/EditableObject';
import { QueueDocumentRect } from '../../store/document';
import { QueueSquareWithEffect } from '../../model/object/rect';
import { Scaler } from '../scaler/Scaler';
import { getCurrentRect } from '../queue/animate/rect';

const Selector = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid gray;
  background-color: rgba(0, 0, 0, 0.2);
`;

export interface QueueEditorContextType {
  selectedObjectIds: string[];
  queueIndex: number;
  scale: number;
  documentRect: QueueDocumentRect;
  objects: QueueSquareWithEffect[];
}

export const QueueEditorContext = createContext<QueueEditorContextType>({
  selectedObjectIds: [],
  queueIndex: 0,
  scale: 1,
  documentRect: {
    width: 0,
    height: 0,
  },
  objects: [],
});

export interface QueueEditorProps {
  /**
   * @description
   * 현재 큐 인덱스
   */
  queueIndex?: number;

  /**
   * @description
   * 애니메이션 방향
   */
  queuePosition?: 'forward' | 'backward' | 'pause';

  /**
   * @description
   * 문서 크기
   *
   *  @default { width: 0, height: 0 }
   */
  documentRect?: QueueDocumentRect;

  /**
   * @description
   * 스케일
   *
   * @default 1
   */
  scale?: number;

  /**
   * @description
   * 큐 오브젝트
   *
   * @default []
   */
  objects?: QueueSquareWithEffect[];

  /**
   * @description
   * 큐 애니메이션 종료 시 이벤트
   */
  onAnimationEnd?: () => void;
}

export interface QueueEditorRef {
  /**
   * @description
   * 현재 큐의 애니메이션 재생
   *
   * @param reverse - 역재생 여부
   */
  animate(reverse?: boolean): void;

  /**
   * @description
   * 큐 자동 재생
   */
  play(): void;

  /**
   * @description
   * 현재 큐에서 id 가 일치하는 오브젝트를 선택
   *
   * @param ids - 선택할 오브젝트 아이디
   */
  select(ids: string[]): void;
}

export const QueueEditor = forwardRef<QueueEditorRef, QueueEditorProps>(
  (
    {
      queueIndex = 0,
      queuePosition = 'pause',
      objects = [],
      documentRect = { width: 0, height: 0 },
      scale = 1,
    },
    ref
  ) => {
    const canvasDiv = useRef<HTMLDivElement>(null);

    const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);

    useImperativeHandle(
      ref,
      () => ({
        animate: (): void => {
          return;
        },
        play: (): void => {
          return;
        },
        select: (): void => {
          return;
        },
      }),
      []
    );

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
      const absScale = 1 / scale;
      const x = (event.drawClientX - rect.x) * absScale;
      const y = (event.drawClientY - rect.y) * absScale;
      const width = event.width * absScale;
      const height = event.height * absScale;
      const selectedObjects = objects.filter((object) => {
        const rect = getCurrentRect(object, queueIndex);
        return (
          rect.x >= x &&
          rect.y >= y &&
          rect.x + rect.width <= x + width &&
          rect.y + rect.height <= y + height
        );
      });
      setSelectedObjectIds(selectedObjects.map((object) => object.uuid));
    };

    useLayoutEffect(() => {
      setSelectedObjectIds([]);
    }, [queueIndex]);

    return (
      <Drawable
        scale={scale}
        drawer={<Selector></Selector>}
        onDrawEnd={(e): void => onDrawEnd(e)}
        className={css`
          flex: 1;
          background: #e9eaed;
          overflow: auto;
          display: flex;
        `}
      >
        <Scaler
          width={documentRect.width}
          height={documentRect.height}
          scale={scale}
        >
          <QueueEditorContext.Provider
            value={{
              selectedObjectIds: selectedObjectIds,
              documentRect: documentRect,
              scale: scale,
              queueIndex: queueIndex,
              objects: objects,
            }}
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
                width: documentRect.width,
                height: documentRect.height,
              }}
            >
              {objects.map((object, i) => (
                <QueueObject
                  key={object.uuid + queueIndex}
                  position={queuePosition}
                  index={queueIndex}
                  selected={selectedObjectIds.includes(object.uuid)}
                  object={object}
                ></QueueObject>
              ))}
            </div>
          </QueueEditorContext.Provider>
        </Scaler>
      </Drawable>
    );
  }
);
