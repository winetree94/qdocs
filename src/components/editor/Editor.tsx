import { FunctionComponent, useRef, useState } from 'react';
import { Drawable, DrawEvent } from '../../cdk/draw/Draw';
import {
  isExistObjectOnQueue,
} from '../../model/object/square';
import { Scaler } from '../scaler/Scaler';
import { getCurrentRect } from '../queue/animate/rect';
import { QueueObject } from 'components/queue';
import { QueueContextMenu } from 'components/queue-context-menu/Context';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import styles from './Editor.module.scss';
import { QueueRect, QueueRotate } from 'model/property';
import { QueueObjectType } from 'model/object';
import { useSettings } from 'cdk/hooks/settings';
import { useQueueDocument } from 'cdk/hooks/queueDocument';

export const QueueEditor: FunctionComponent = () => {
  const canvasDiv = useRef<HTMLDivElement>(null);
  const [translateTargets, setTranslateTargets] = useState<string[]>([]);
  const { queueDocument, ...setQueueDocument } = useQueueDocument();
  const { settings, ...setSettings } = useSettings();
  const currentQueueObjects = queueDocument!.pages[settings.queuePage].objects.filter((object) =>
    isExistObjectOnQueue(object, settings.queueIndex)
  );

  const [resizing, setResizing] = useState<QueueRect>(null);
  const [rotating, setRotating] = useState<QueueRotate>(null);
  const [moving, setMoving] = useState<Pick<QueueRect, 'x' | 'y'>>(null);

  const onObjectMouseodown = (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    object: QueueObjectType,
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
    object: QueueObjectType,
  ): void => {
    event.stopPropagation();
    setSettings.setDetailSettingMode(object.uuid);
  };

  const onObjectDragMove = (
    initEvent: MouseEvent,
    event: MouseEvent,
    object: QueueObjectType,
  ): void => {
    const diffX = (event.clientX - initEvent.clientX);
    const diffY = event.clientY - initEvent.clientY;
    const currentScale = 1 / settings.scale;

    const targetX = (diffX * currentScale);
    const targetY = (diffY * currentScale);

    const adjacentTargetX = event.shiftKey ? targetX : Math.round(targetX / 30) * 30;
    const adjacentTargetY = event.shiftKey ? targetY : Math.round(targetY / 30) * 30;

    setMoving({
      x: adjacentTargetX,
      y: adjacentTargetY,
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

    const adjacentTargetX = event.shiftKey ? diffX : Math.round(diffX / 30) * 30;
    const adjacentTargetY = event.shiftKey ? diffY : Math.round(diffY / 30) * 30;

    const updateModels = queueDocument!.pages[settings.queuePage].objects
      .filter((object) => settings.selectedObjectUUIDs.includes(object.uuid))
      .map((object) => {
        const rect = getCurrentRect(object, settings.queueIndex);
        return {
          uuid: object.uuid,
          rect: {
            rect: {
              x: rect.x + adjacentTargetX,
              y: rect.y + adjacentTargetY,
              width: rect.width,
              height: rect.height,
            },
          },
        };
      });

    setSettings.stopAnimation();
    setQueueDocument.updateObjectProp(settings.queuePage, updateModels.map((model) => ({
      uuid: model.uuid,
      queueIndex: settings.queueIndex,
      props: {
        rect: model.rect,
      }
    })));
    setMoving(null);
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
    const hasSelectableObject = queueDocument!.pages[settings.queuePage].objects.some((object) => {
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
    const selectedObjects = queueDocument!.pages[settings.queuePage].objects.filter((object) => {
      const rect = getCurrentRect(object, settings.queueIndex);
      return (
        rect.x >= x &&
        rect.y >= y &&
        rect.x + rect.width <= x + width &&
        rect.y + rect.height <= y + height
      );
    });

    setSettings.setSelectedObjectUUIDs(selectedObjects.map((object) => object.uuid));
  };

  const onResizeStart = (object: QueueObjectType): void => {
    setTranslateTargets([
      object.uuid
    ]);
  };

  const onResizeMove = (object: QueueObjectType, rect: QueueRect): void => {
    setResizing(rect);
  };

  const onResizeEnd = (object: QueueObjectType, rect: QueueRect): void => {
    setQueueDocument.updateObjectProp(settings.queuePage, [{
      uuid: object.uuid,
      queueIndex: settings.queueIndex,
      props: {
        rect: {
          rect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          }
        }
      }
    }]);
    setResizing(null);
    setRotating(null);
    setTranslateTargets([]);
  };

  const onRotateStart = (object: QueueObjectType): void => {
    setTranslateTargets([
      object.uuid
    ]);
  };

  const onRotateMove = (object: QueueObjectType, rotate: { degree: number }): void => {
    setRotating({
      position: 'forward',
      degree: rotate.degree,
    });
  };

  const onRotateEnd = (object: QueueObjectType, rotate: { degree: number }): void => {
    setQueueDocument.updateObjectProp(settings.queuePage, [{
      uuid: object.uuid,
      queueIndex: settings.queueIndex,
      props: {
        rotate: {
          rotate: {
            degree: rotate.degree,
            position: 'forward',
          },
        },
      },
    }]);
    setRotating(null);
    setResizing(null);
    setTranslateTargets([]);
  };

  const onTextEdit = (object: QueueObjectType, text: string): void => {
    setQueueDocument.updateObjectProp(settings.queuePage, [{
      uuid: object.uuid,
      queueIndex: settings.queueIndex,
      props: {
        text: {
          text: {
            ...object.text,
            text,
          }
        },
      },
    }]);
  };

  return (
    <QueueContextMenu.Root
      onOpenChange={(open): void => {
        if (open) {
          setSettings.setSelectedObjectUUIDs([]);
        }
      }}>
      <QueueContextMenu.Trigger
        className={clsx(
          'overflow-auto',
          'flex',
          'flex-1'
        )}>
        <Drawable
          scale={settings.scale}
          drawer={
            <div className={clsx(
              styles.drawer,
              'w-full',
              'h-full',
            )}></div>
          }
          onDrawStart={onDrawStart}
          onDrawEnd={onDrawEnd}
          className={clsx(
            styles.root,
            'flex',
            'flex-col',
            'flex-1',
            'overflow-auto',
          )}
        >
          <Scaler
            width={queueDocument!.documentRect.width}
            height={queueDocument!.documentRect.height}
            scale={settings.scale}
          >
            <div
              ref={canvasDiv}
              className={clsx(
                styles.canvas,
                'relative',
                'box-border',
              )}
              style={{
                width: queueDocument!.documentRect.width,
                height: queueDocument!.documentRect.height,
                background: queueDocument!.documentRect.fill,
              }}
            >
              {currentQueueObjects.map((object, index) => {
                return (
                  <QueueContextMenu.Root
                    key={object.uuid}
                    onOpenChange={(open): void => {
                      if (open && !settings.selectedObjectUUIDs.includes(object.uuid)) {
                        setSettings.setSelectedObjectUUIDs([object.uuid]);
                      }
                    }}>
                    <QueueContextMenu.Trigger>
                      <QueueObject.Container
                        className='queue-object-root'
                        object={object}
                        detail={settings.selectionMode === 'detail' && settings.selectedObjectUUIDs.includes(object.uuid)}
                        documentScale={settings.scale}
                        move={translateTargets.includes(object.uuid) ? moving : undefined}
                        transform={translateTargets.includes(object.uuid) ? resizing : undefined}
                        rotate={translateTargets.includes(object.uuid) ? rotating : undefined}
                        selected={settings.selectedObjectUUIDs.includes(object.uuid)}>
                        <QueueObject.Animator
                          queueIndex={settings.queueIndex}
                          queuePosition={settings.queuePosition}
                          queueStart={settings.queueStart}>
                          <QueueObject.Drag
                            onMousedown={(event): void => onObjectMouseodown(event, object)}
                            onDoubleClick={(event): void => onObjectDoubleClick(event, object)}
                            onDraggingStart={(initEvent, currentEvent): void => onObjectDragMove(initEvent, currentEvent, object)}
                            onDraggingMove={(initEvent, currentEvent): void => onObjectDragMove(initEvent, currentEvent, object)}
                            onDraggingEnd={onObjectDragEnd}
                          >
                            <QueueObject.Rect></QueueObject.Rect>
                            <QueueObject.Text onEdit={(e): void => onTextEdit(object, e)}></QueueObject.Text>
                            <QueueObject.Resizer
                              onResizeStart={(event): void => onResizeStart(object)}
                              onResizeMove={(event): void => onResizeMove(object, event)}
                              onResizeEnd={(event): void => onResizeEnd(object, event)}
                              onRotateStart={(event): void => onRotateStart(object)}
                              onRotateMove={(event): void => onRotateMove(object, event)}
                              onRotateEnd={(event): void => onRotateEnd(object, event)}
                            ></QueueObject.Resizer>
                          </QueueObject.Drag>
                        </QueueObject.Animator>
                      </QueueObject.Container>
                    </QueueContextMenu.Trigger>
                    <QueueContextMenu.Portal>
                      <QueueContextMenu.Content
                        onInteractOutside={(e): void => console.log(e)}
                        onMouseDown={(e): void => e.stopPropagation()}>
                        <QueueContextMenu.Item
                          onClick={(): void => setQueueDocument.removeObjectOnQueue(settings.selectedObjectUUIDs)}>
                          현재 큐에서 삭제 <div className={styles.RightSlot}>Backspace</div>
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Item
                          onClick={(): void => setQueueDocument.removeObject(settings.selectedObjectUUIDs)}>
                          오브젝트 삭제 <div className={styles.RightSlot}>⌘+Backspace</div>
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Separator />
                        <QueueContextMenu.Item >
                          잘라내기 <div className={styles.RightSlot}>⌘+T</div>
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Item>
                          복사 <div className={styles.RightSlot}>⌘+C</div>
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Separator />
                        <QueueContextMenu.Item
                          onClick={(): void => setQueueDocument.changeObjectIndex(settings.selectedObjectUUIDs, 'start')}>
                          맨 앞으로 가져오기
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Item
                          onClick={(): void => setQueueDocument.changeObjectIndex(settings.selectedObjectUUIDs, 'end')}>
                          맨 뒤로 보내기
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Item
                          onClick={(): void => setQueueDocument.changeObjectIndex(settings.selectedObjectUUIDs, 'forward')}>
                          앞으로 가져오기
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Item
                          onClick={(): void => setQueueDocument.changeObjectIndex(settings.selectedObjectUUIDs, 'backward')}>
                          뒤로 보내기
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Separator />
                        <QueueContextMenu.Item >
                          그룹
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Item>
                          그룹 해제
                        </QueueContextMenu.Item>
                        <QueueContextMenu.Separator />
                        <QueueContextMenu.Sub>
                          <QueueContextMenu.SubTrigger>
                            더보기
                            <div className={styles.RightSlot}>
                              <ChevronRightIcon />
                            </div>
                          </QueueContextMenu.SubTrigger>
                          <QueueContextMenu.Portal>
                            <QueueContextMenu.SubContent
                              sideOffset={2}
                              alignOffset={-5}
                            >
                              <QueueContextMenu.Item>
                                Save Page As… <div className={styles.RightSlot}>⌘+S</div>
                              </QueueContextMenu.Item>
                              <QueueContextMenu.Item>Create Shortcut…</QueueContextMenu.Item>
                              <QueueContextMenu.Item>Name Window…</QueueContextMenu.Item>
                              <QueueContextMenu.Separator />
                              <QueueContextMenu.Item>Developer Tools</QueueContextMenu.Item>
                            </QueueContextMenu.SubContent>
                          </QueueContextMenu.Portal>
                        </QueueContextMenu.Sub>
                      </QueueContextMenu.Content>
                    </QueueContextMenu.Portal>
                  </QueueContextMenu.Root>
                );
              })}
            </div>
          </Scaler>
        </Drawable>
      </QueueContextMenu.Trigger>
      <QueueContextMenu.Portal>
        <QueueContextMenu.Content
          onInteractOutside={(e): void => console.log(e)}>
          <QueueContextMenu.Item>
            실행 취소 <div className={styles.RightSlot}>⌘+Z</div>
          </QueueContextMenu.Item>
          <QueueContextMenu.Item>
            다시 실행 <div className={styles.RightSlot}>⌘+Shift+Z</div>
          </QueueContextMenu.Item>
          <QueueContextMenu.Separator />
          <QueueContextMenu.Item>
            붙여넣기 <div className={styles.RightSlot}>⌘+V</div>
          </QueueContextMenu.Item>
          <QueueContextMenu.Item>
            이 위치로 붙여넣기 <div className={styles.RightSlot}>⌘+V</div>
          </QueueContextMenu.Item>
        </QueueContextMenu.Content>
      </QueueContextMenu.Portal>
    </QueueContextMenu.Root>
  );
};
