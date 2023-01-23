/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { FunctionComponent, useRef, useState } from 'react';
import { Drawable, DrawEvent } from '../../cdk/draw/Draw';
import { documentState } from '../../store/document';
import {
  isExistObjectOnQueue,
  QueueRect,
  QueueSquare,
} from '../../model/object/rect';
import { Scaler } from '../scaler/Scaler';
import { getCurrentRect, getCurrentScaledRect } from '../queue/animate/rect';
import { useRecoilState } from 'recoil';
import { documentSettingsState } from '../../store/settings';
import { QueueObject } from 'components/queue';
import { getCurrentScale } from 'components/queue/animate/scale';
import { QueueDocumentRect, QueueObjectType } from 'model/document';

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
  objects: QueueSquare[];
  currentQueueObjects: QueueSquare[];
}

export interface RectUpdateModel {
  uuid: string;
  queueIndex: number;
  rect: QueueRect;
}

export const QueueEditor: FunctionComponent = () => {
  const canvasDiv = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState<QueueRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [translateTargets, setTranslateTargets] = useState<string[]>([]);
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const [settings, setSettings] = useRecoilState(documentSettingsState);
  const currentQueueObjects = queueDocument!.objects.filter((object) =>
    isExistObjectOnQueue(object, settings.queueIndex)
  );

  const updateObjectRects = (models: RectUpdateModel[]): void => {
    const newObjects = queueDocument!.objects.map((object) => {
      const model = models.find((model) => model.uuid === object.uuid);
      if (!model) {
        return object;
      }
      const slicedObject = { ...object, effects: object.effects.slice(0) };
      const createEffectIndex = object.effects.find(
        (effect) => effect.type === 'create'
      )!.index;
      const moveEffectIndex = object.effects.findIndex(
        (effect) => effect.type === 'move' && effect.index === model.queueIndex
      );

      if (createEffectIndex === model.queueIndex) {
        slicedObject.rect = model.rect;
      }

      if (createEffectIndex !== model.queueIndex && moveEffectIndex !== -1) {
        slicedObject.effects[moveEffectIndex] = {
          ...slicedObject.effects[moveEffectIndex],
          type: 'move',
          rect: {
            ...model.rect,
          },
        };
      }

      if (createEffectIndex !== model.queueIndex && moveEffectIndex === -1) {
        slicedObject.effects.push({
          type: 'move',
          index: model.queueIndex,
          duration: 1000,
          timing: 'linear',
          rect: {
            ...model.rect,
          },
        });
        slicedObject.effects.sort((a, b) => a.index - b.index);
      }

      return slicedObject;
    });
    setQueueDocument({ ...queueDocument!, objects: newObjects });
  };

  const onObjectMouseodown = (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    object: QueueObjectType,
  ): void => {
    event.stopPropagation();
    const selected = settings.selectedObjectUUIDs.includes(object.uuid);
    if (!event.shiftKey && !selected) {
      setSettings({
        ...settings,
        selectedObjectUUIDs: [object.uuid],
      });
    } else {
      setSettings({
        ...settings,
        selectedObjectUUIDs: selected
          ? settings.selectedObjectUUIDs.filter((id) => id !== object.uuid)
          : [...settings.selectedObjectUUIDs, object.uuid],
      });
    }
  };

  const onObjectDragMove = (
    initEvent: MouseEvent,
    event: MouseEvent,
    object: QueueObjectType,
  ): void => {
    const x = event.clientX - initEvent.clientX;
    const y = event.clientY - initEvent.clientY;
    const currentScale = 1 / settings.scale;
    const objectScale = 1 / getCurrentScale(object, settings.queueIndex).scale;
    setTranslate({
      x: x * currentScale * objectScale,
      y: y * currentScale * objectScale,
      width: 0,
      height: 0,
    });
    setTranslateTargets(settings.selectedObjectUUIDs);
  };

  const onObjectDragEnd = (
    initEvent: MouseEvent,
    event: MouseEvent,
  ): void => {
    const x = event.clientX - initEvent.clientX;
    const y = event.clientY - initEvent.clientY;
    const currentScale = 1 / settings.scale;
    const diffX = x * currentScale;
    const diffY = y * currentScale;
    const updateModels = queueDocument!.objects
      .filter((object) => settings.selectedObjectUUIDs.includes(object.uuid))
      .map<RectUpdateModel>((object) => {
        const rect = getCurrentRect(object, settings.queueIndex);
        return {
          uuid: object.uuid,
          queueIndex: settings.queueIndex,
          rect: {
            x: rect.x + diffX,
            y: rect.y + diffY,
            width: rect.width,
            height: rect.height,
          },
        };
      });
    setSettings({
      ...settings,
      queueStart: -1,
    });
    updateObjectRects(updateModels);
    setTranslate({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
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
    const absScale = 1 / settings.scale;
    const x = (event.drawClientX - rect.x) * absScale;
    const y = (event.drawClientY - rect.y) * absScale;
    const hasSelectableObject = queueDocument!.objects.some((object) => {
      const rect = getCurrentRect(object, settings.queueIndex);
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
    const absScale = 1 / settings.scale;
    const x = (event.drawClientX - rect.x) * absScale;
    const y = (event.drawClientY - rect.y) * absScale;
    const width = event.width * absScale;
    const height = event.height * absScale;
    const selectedObjects = queueDocument!.objects.filter((object) => {
      const rect = getCurrentScaledRect(object, settings.queueIndex);
      return (
        rect.x >= x &&
        rect.y >= y &&
        rect.x + rect.width <= x + width &&
        rect.y + rect.height <= y + height
      );
    });
    setSettings({
      ...settings,
      selectedObjectUUIDs: selectedObjects.map((object) => object.uuid),
    });
  };

  const onResizeStart = (object: QueueObjectType): void => {
    setTranslateTargets([
      object.uuid
    ]);
  };

  const onResizeMove = (object: QueueObjectType, rect: QueueRect): void => {
    setTranslate(rect);
  };

  const onResizeEnd = (object: QueueObjectType, rect: QueueRect): void => {
    const currentScale = getCurrentScale(object, settings.queueIndex).scale;
    const currentRect = getCurrentRect(object, settings.queueIndex);
    updateObjectRects([
      {
        uuid: object.uuid,
        queueIndex: settings.queueIndex,
        rect: {
          x: currentRect.x + rect.x,
          y: currentRect.y + rect.y,
          width: currentRect.width + rect.width,
          height: currentRect.height + rect.height,
        },
      },
    ]);
    setTranslate({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
    setTranslateTargets([]);
  };

  const onObjectAnimationEnd = (object: QueueObjectType): void => {
    console.log('animation finished: ', object);
  };

  return (
    <Drawable
      scale={settings.scale}
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
        width={queueDocument!.documentRect.width}
        height={queueDocument!.documentRect.height}
        scale={settings.scale}
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
            width: queueDocument!.documentRect.width,
            height: queueDocument!.documentRect.height,
          }}
        >
          {currentQueueObjects.map((object) => {
            return (
              <QueueObject.Container
                className='queue-object-root'
                key={object.uuid}
                object={object}
                documentScale={settings.scale}
                transform={translateTargets.includes(object.uuid) ? translate : undefined}
                selected={settings.selectedObjectUUIDs.includes(object.uuid)}>
                <QueueObject.Animator
                  queueIndex={settings.queueIndex}
                  queuePosition={settings.queuePosition}
                  queueStart={settings.queueStart}>
                  <QueueObject.Drag
                    onMousedown={(event): void => onObjectMouseodown(event, object)}
                    onDraggingStart={(initEvent, currentEvent): void => onObjectDragMove(initEvent, currentEvent, object)}
                    onDraggingMove={(initEvent, currentEvent): void => onObjectDragMove(initEvent, currentEvent, object)}
                    onDraggingEnd={onObjectDragEnd}
                  >
                    <QueueObject.Rect></QueueObject.Rect>
                    <QueueObject.Text></QueueObject.Text>
                    <QueueObject.Resizer
                      onResizeStart={(event): void => onResizeStart(object)}
                      onResizeMove={(event): void => onResizeMove(object, event)}
                      onResizeEnd={(event): void => onResizeEnd(object, event)}
                    ></QueueObject.Resizer>
                  </QueueObject.Drag>
                </QueueObject.Animator>
              </QueueObject.Container>
            );
          })}
        </div>
      </Scaler>
    </Drawable>
  );
};
