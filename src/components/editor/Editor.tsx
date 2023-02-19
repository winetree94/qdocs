import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Drawable, DrawEvent } from '../../cdk/draw/Draw';
import { Scaler } from '../scaler/Scaler';
import { getCurrentRect } from '../queue/animate/rect';
import { QueueObject } from 'components/queue';
import { QueueContextMenu } from 'components/context-menu/Context';
import clsx from 'clsx';
import styles from './Editor.module.scss';
import { QueueObjectType } from 'model/object';
import { useSettings } from 'cdk/hooks/useSettings';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { queueObjects } from 'store/object';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useBatching } from 'cdk/hooks/useUndo';
import { ResizerEvent } from 'components/queue/Resizer';
import {
  objectDefaultProps,
  ObjectQueueEffects,
  objectQueueEffects,
  objectQueueProps,
  ObjectQueueProps,
} from 'store/effects';
import { MoveEffect, RotateEffect } from 'model/effect';
import { adjacent } from 'cdk/math/adjacent';
import { EditorContext } from './EditorContext';
import { documentState } from 'store/document';
import { PresentationRemote } from './PresentationRemote';

export const QueueEditor: React.FC = () => {
  const rootRef = useRef<HTMLSpanElement>(null);
  const canvasDiv = useRef<HTMLDivElement>(null);
  const { startBatch, endBatch } = useBatching();

  const queueDocument = useRecoilValue(documentState);
  const { settings, ...setSettings } = useSettings();

  const objects = useRecoilValue(queueObjects({
    pageIndex: settings.queuePage,
    queueIndex: settings.queueIndex,
  }));

  const [defaultProps, setDefaultProps] = useRecoilState(objectDefaultProps({
    pageIndex: settings.queuePage,
  }));

  const queueProps = useRecoilValue(objectQueueProps({
    pageIndex: settings.queuePage,
    queueIndex: settings.queueIndex,
  }));

  const [queueEffects, setQueueEffects] = useRecoilState(objectQueueEffects({
    pageIndex: settings.queuePage,
    queueIndex: settings.queueIndex,
  }));

  const [capturedObjectProps, setCapturedObjectProps] = useState<{
    [key: string]: ObjectQueueProps;
  }>({});

  // 최초 렌더링 시 스케일 계산
  useLayoutEffect(() => {
    const root = rootRef.current!;
    const scale = Math.min(
      root.clientWidth / (queueDocument!.documentRect.width + 40),
      root.clientHeight / (queueDocument!.documentRect.height + 40)
    );
    setSettings.setScale(scale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onObjectMousedown = (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    object: QueueObjectType
  ): void => {
    event.stopPropagation();
    const selected = settings.selectedObjectUUIDs.includes(object.uuid);
    if (!event.shiftKey && !selected) {
      setSettings.setSelectedObjectUUIDs([object.uuid]);
    } else {
      setSettings.setSelectedObjectUUIDs([
        ...settings.selectedObjectUUIDs.filter((id) => id !== object.uuid),
        object.uuid,
      ]);
    }
  };

  const onObjectDoubleClick = (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    object: QueueObjectType
  ): void => {
    event.stopPropagation();
    setSettings.setDetailSettingMode(object.uuid);
  };

  const onObjectDragStart = (): void => {
    startBatch();
    setCapturedObjectProps(queueProps);
  };

  const onUpdateDrag = (
    initEvent: MouseEvent,
    event: MouseEvent,
  ): void => {
    const diffX = event.clientX - initEvent.clientX;
    const diffY = event.clientY - initEvent.clientY;
    const currentScale = 1 / settings.scale;

    const targetX = diffX * currentScale;
    const targetY = diffY * currentScale;
    const adjacentTargetX = event.shiftKey ? targetX : adjacent(targetX, 30);
    const adjacentTargetY = event.shiftKey ? targetY : adjacent(targetY, 30);

    const updateModels = settings.selectedObjectUUIDs.reduce<{ [key: string]: ObjectQueueEffects }>((result, uuid) => {
      const nextEffect: MoveEffect = {
        type: 'rect',
        duration: 1000,
        index: settings.queueIndex,
        timing: 'linear',
        ...queueEffects[uuid].rect,
        rect: {
          ...queueProps[uuid].rect,
          x: capturedObjectProps[uuid].rect.x + adjacentTargetX,
          y: capturedObjectProps[uuid].rect.y + adjacentTargetY,
        }
      };
      result[uuid] = {
        ...queueEffects[uuid],
        rect: nextEffect,
      };
      return result;
    }, {});

    setQueueEffects({
      ...queueEffects,
      ...updateModels,
    });
  };

  const onObjectDragMove = (
    initEvent: MouseEvent,
    event: MouseEvent,
  ): void => {
    onUpdateDrag(initEvent, event);
  };

  const onObjectDragEnd = (initEvent: MouseEvent, event: MouseEvent): void => {
    onUpdateDrag(initEvent, event);
    endBatch();
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
    const hasSelectableObject = queueDocument!.pages[
      settings.queuePage
    ].objects.some((object) => {
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
    const selectedObjects = queueDocument!.pages[
      settings.queuePage
    ].objects.filter((object) => {
      const rect = getCurrentRect(object, settings.queueIndex);
      return (
        rect.x >= x &&
        rect.y >= y &&
        rect.x + rect.width <= x + width &&
        rect.y + rect.height <= y + height
      );
    });
    setSettings.setSelectedObjectUUIDs(
      selectedObjects.map((object) => object.uuid)
    );
  };

  const resizeObjectRect = (uuid: string, rect: ResizerEvent): void => {
    const nextEffect: MoveEffect = {
      type: 'rect',
      duration: 1000,
      index: settings.queueIndex,
      timing: 'linear',
      ...queueEffects[uuid].rect,
      rect: {
        ...queueProps[uuid].rect,
        ...rect
      }
    };
    setQueueEffects({
      ...queueEffects,
      [uuid]: {
        ...queueEffects[uuid],
        rect: nextEffect,
      }
    });
  };

  const onResizeStart = (object: QueueObjectType, rect: ResizerEvent): void => {
    startBatch();
    resizeObjectRect(object.uuid, rect);
  };

  const onResizeMove = (object: QueueObjectType, rect: ResizerEvent): void => {
    resizeObjectRect(object.uuid, rect);
  };

  const onResizeEnd = (object: QueueObjectType, rect: ResizerEvent): void => {
    resizeObjectRect(object.uuid, rect);
    endBatch();
  };

  const updateObjectRotate = (uuid: string, degree: number): void => {
    const nextEffect: RotateEffect = {
      type: 'rotate',
      duration: 1000,
      index: settings.queueIndex,
      timing: 'linear',
      ...queueEffects[uuid].rotate,
      rotate: {
        degree: degree,
      }
    };
    setQueueEffects({
      ...queueEffects,
      [uuid]: {
        ...queueEffects[uuid],
        rotate: nextEffect,
      }
    });
  };

  const onRotateStart = (): void => {
    startBatch();
  };

  const onRotateMove = (uuid: string, degree: number): void => {
    updateObjectRotate(uuid, degree);
  };

  const onRotateEnd = (uuid: string, degree: number): void => {
    updateObjectRotate(uuid, degree);
    endBatch();
  };

  useEffect(() => {
    if (!settings.presentationMode) {
      return;
    }
    const resize = (): void => {
      const scale = Math.min(
        document.body.clientWidth / queueDocument!.documentRect.width,
        document.body.clientHeight / queueDocument!.documentRect.height
      );
      setSettings.setScale(scale);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(document.body);
    resize();
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.presentationMode]);

  const onTextEdit = (object: QueueObjectType, text: string): void => {
    setDefaultProps({
      ...defaultProps,
      [object.uuid]: {
        ...defaultProps[object.uuid],
        text: {
          ...defaultProps[object.uuid].text,
          text,
        }
      }
    });
  };

  const onRootContextMenuOpenChange = (open: boolean): void => {
    if (open) {
      setSettings.setSelectedObjectUUIDs([]);
    }
  };

  const onObjectContextMenuOpenChange = (uuid: string, open: boolean): void => {
    if (open && !settings.selectedObjectUUIDs.includes(uuid)) {
      setSettings.setSelectedObjectUUIDs([uuid]);
    }
  };

  return (
    <QueueContextMenu.Root onOpenChange={onRootContextMenuOpenChange}>
      <QueueContextMenu.Trigger ref={rootRef} className={clsx(styles.Root)}>
        <QueueScrollArea.Root className={clsx(styles.ScrollAreaRoot)}>
          <QueueScrollArea.Viewport className={clsx('flex')}>
            <Drawable
              scale={settings.scale}
              drawer={<div className={clsx(styles.drawer, 'w-full', 'h-full')}></div>}
              onDrawStart={onDrawStart}
              onDrawEnd={onDrawEnd}
              className={clsx(styles.Drawable, settings.presentationMode ? styles.fullscreen : '')}>
              <Scaler
                width={queueDocument!.documentRect.width}
                height={queueDocument!.documentRect.height}
                scale={settings.scale}
                className={clsx(settings.presentationMode ? styles.scaleFull : '')}>
                <div
                  ref={canvasDiv}
                  className={clsx(styles.canvas)}
                  style={{
                    width: queueDocument!.documentRect.width,
                    height: queueDocument!.documentRect.height,
                    background: queueDocument!.documentRect.fill,
                  }}>
                  {objects.map((object) => (
                    <QueueContextMenu.Root
                      key={object.uuid}
                      onOpenChange={(open): void => onObjectContextMenuOpenChange(object.uuid, open)}>
                      <QueueContextMenu.Trigger>
                        <QueueObject.Container
                          object={object}
                          detail={settings.selectionMode === 'detail' && settings.selectedObjectUUIDs.includes(object.uuid)}
                          documentScale={settings.scale}
                          selected={settings.selectedObjectUUIDs.includes(object.uuid)}>
                          <QueueObject.Animator
                            queueIndex={settings.queueIndex}
                            queuePosition={settings.queuePosition}
                            queueStart={settings.queueStart}>
                            <QueueObject.Drag
                              onMousedown={(event): void => onObjectMousedown(event, object)}
                              onDoubleClick={(event): void => onObjectDoubleClick(event, object)}
                              onDraggingStart={onObjectDragStart}
                              onDraggingMove={onObjectDragMove}
                              onDraggingEnd={onObjectDragEnd}>
                              <QueueObject.Rect></QueueObject.Rect>
                              <QueueObject.Text onEdit={(e): void => onTextEdit(object, e)} />
                              <QueueObject.Resizer
                                onResizeStart={(event): void => onResizeStart(object, event)}
                                onResizeMove={(event): void => onResizeMove(object, event)}
                                onResizeEnd={(event): void => onResizeEnd(object, event)}
                                onRotateStart={(): void => onRotateStart()}
                                onRotateMove={(event): void => onRotateMove(object.uuid, event.degree)}
                                onRotateEnd={(event): void => onRotateEnd(object.uuid, event.degree)} />
                            </QueueObject.Drag>
                          </QueueObject.Animator>
                        </QueueObject.Container>
                      </QueueContextMenu.Trigger>
                      <QueueContextMenu.Portal>
                        <QueueObject.ContextContent />
                      </QueueContextMenu.Portal>
                    </QueueContextMenu.Root>
                  ))}
                </div>
              </Scaler>
              {settings.presentationMode && (
                <PresentationRemote />
              )}
            </Drawable>
          </QueueScrollArea.Viewport>
          <QueueScrollArea.Scrollbar orientation="vertical">
            <QueueScrollArea.Thumb />
          </QueueScrollArea.Scrollbar>
          <QueueScrollArea.Scrollbar orientation="horizontal">
            <QueueScrollArea.Thumb />
          </QueueScrollArea.Scrollbar>
          <QueueScrollArea.Corner />
        </QueueScrollArea.Root>
      </QueueContextMenu.Trigger>
      <QueueContextMenu.Portal>
        <EditorContext />
      </QueueContextMenu.Portal>
    </QueueContextMenu.Root>
  );
};
