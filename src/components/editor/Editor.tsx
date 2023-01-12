/* eslint-disable @typescript-eslint/no-unused-vars */
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import {
  createContext,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Drawable, DrawEvent } from '../../cdk/draw/Draw';
import { QueueObject } from '../queue/EditableObject';
import {
  QueueDocumentRect,
  selectedObjectIdsState,
} from '../../store/document';
import {
  isExistObjectOnQueue,
  QueueSquareRect,
  QueueSquareWithEffect,
} from '../../model/object/rect';
import { Scaler } from '../scaler/Scaler';
import { getCurrentRect } from '../queue/animate/rect';
import { useRecoilState } from 'recoil';

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
  currentQueueObjects: QueueSquareWithEffect[];
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
  currentQueueObjects: [],
});
QueueEditorContext.displayName = 'QueueEditorContext';

export interface RectUpdateModel {
  uuid: string;
  queueIndex: number;
  rect: QueueSquareRect;
}

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
   * 오브젝트가 드래그로 움직인 경우 이벤트
   */
  onObjectRectUpdate?: (models: RectUpdateModel[]) => void;

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
      onObjectRectUpdate,
    },
    ref
  ) => {
    const canvasDiv = useRef<HTMLDivElement>(null);
    const [translate, setTranslate] = useState<{ x: number; y: number }>({
      x: 0,
      y: 0,
    });
    const currentQueueObjects = objects.filter((object) =>
      isExistObjectOnQueue(object, queueIndex)
    );
    // const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);
    const [selectedObjectIds, setSelectedObjectIds] = useRecoilState(
      selectedObjectIdsState
    );

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
      event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
      object: QueueSquareWithEffect
    ): void => {
      let slicedSelectedObjectIds = [...selectedObjectIds];
      const selected = selectedObjectIds.includes(object.uuid);
      const initX = event.clientX;
      const initY = event.clientY;
      let diffX = 0;
      let diffY = 0;
      if (!selected) {
        setSelectedObjectIds([object.uuid]);
        slicedSelectedObjectIds = [object.uuid];
      }
      const mover = (event: MouseEvent): void => {
        const x = event.clientX - initX;
        const y = event.clientY - initY;
        const currentScale = 1 / scale;
        setTranslate({ x: x * currentScale, y: y * currentScale });
        diffX = x * currentScale;
        diffY = y * currentScale;
      };
      const finish = (event: MouseEvent): void => {
        const updateModels = objects
          .filter((object) => slicedSelectedObjectIds.includes(object.uuid))
          .map<RectUpdateModel>((object) => {
            const rect = getCurrentRect(object, queueIndex);
            return {
              uuid: object.uuid,
              queueIndex: queueIndex,
              rect: {
                x: rect.x + diffX,
                y: rect.y + diffY,
                width: rect.width,
                height: rect.height,
              },
            };
          });
        if (onObjectRectUpdate) {
          onObjectRectUpdate(updateModels);
        }
        document.removeEventListener('mousemove', mover);
        document.removeEventListener('mouseup', finish);
        setTranslate({ x: 0, y: 0 });
      };

      document.addEventListener('mousemove', mover);
      document.addEventListener('mouseup', finish);
    };

    /**
     * @description
     * 드로잉 시작 시 시작 지점에 오브젝트가 있으면 드로잉을 취소 (오브젝트 이동 동작을 수행해야 함)
     */
    const onDrawStart = (event: DrawEvent, cancel: () => void): void => {
      if (!canvasDiv.current) {
        return;
      }
      const rect = canvasDiv.current.getBoundingClientRect();
      const absScale = 1 / scale;
      const x = (event.drawClientX - rect.x) * absScale;
      const y = (event.drawClientY - rect.y) * absScale;
      const hasSelectableObject = objects.some((object) => {
        const rect = getCurrentRect(object, queueIndex);
        return (
          rect.x <= x &&
          rect.y <= y &&
          rect.x + rect.width >= x &&
          rect.y + rect.height >= y
        );
      });
      if (hasSelectableObject) {
        cancel();
      }
    };

    /**
     * @description
     * 드로잉 종료 시 범위 내 오브젝트를 선택
     */
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
    }, [setSelectedObjectIds, queueIndex]);

    return (
      <Drawable
        scale={scale}
        drawer={<Selector></Selector>}
        onDrawStart={onDrawStart}
        onDrawEnd={onDrawEnd}
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
              currentQueueObjects: currentQueueObjects,
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
              {currentQueueObjects.map((object, i) => (
                <QueueObject
                  key={object.uuid + queueIndex}
                  position={queuePosition}
                  index={queueIndex}
                  selected={selectedObjectIds.includes(object.uuid)}
                  translate={translate}
                  object={object}
                  onMousedown={(event): void => onMousedown(event, object)}
                ></QueueObject>
              ))}
            </div>
          </QueueEditorContext.Provider>
        </Scaler>
      </Drawable>
    );
  }
);
