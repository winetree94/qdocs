/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FunctionComponent,
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
import { ChevronRightIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import styles from './Editor.module.scss';
import { QueueRect } from 'model/property';
import { QueueObjectType } from 'model/object';
import { useSettings } from 'cdk/hooks/useSettings';
import { useQueueDocument } from 'cdk/hooks/useQueueDocument';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { currentQueueObjects, currentQueueObjectUUIDs } from 'store/object';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useBatching } from 'cdk/hooks/useUndo';
import { objectCurrentRects } from 'store/effects/rect';
import { objectCurrentRotates } from 'store/effects/rotate';
import { ResizerEvent } from 'components/queue/Resizer';

export const QueueEditor: FunctionComponent = () => {
  const rootRef = useRef<HTMLSpanElement>(null);
  const canvasDiv = useRef<HTMLDivElement>(null);
  const { startBatch, endBatch } = useBatching();

  const { queueDocument, ...setQueueDocument } = useQueueDocument();
  const { settings, ...setSettings } = useSettings();

  const objects = useRecoilValue(currentQueueObjects({
    pageIndex: settings.queuePage,
    queueIndex: settings.queueIndex,
  }));

  const objectUUIDs = useRecoilValue(currentQueueObjectUUIDs({
    pageIndex: settings.queuePage,
    queueIndex: settings.queueIndex,
  }));

  const [objectRects, setObjectRects] = useRecoilState(objectCurrentRects({
    pageIndex: settings.queuePage,
    queueIndex: settings.queueIndex,
    uuid: objectUUIDs,
  }));

  const [objectRotates, setObjectRotates] = useRecoilState(objectCurrentRotates({
    pageIndex: settings.queuePage,
    queueIndex: settings.queueIndex,
    uuid: objectUUIDs,
  }));

  const [capturedObjectRects, setCapturedObjectRects] = useState<{
    [key: string]: QueueRect;
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

  const onObjectMouseodown = (
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
    setCapturedObjectRects(objectRects);
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

    const adjacentTargetX = event.shiftKey
      ? targetX
      : Math.round(targetX / 30) * 30;

    const adjacentTargetY = event.shiftKey
      ? targetY
      : Math.round(targetY / 30) * 30;

    const updateModel = settings.selectedObjectUUIDs.reduce<{ [key: string]: QueueRect }>((result, uuid) => {
      result[uuid] = {
        ...objectRects[uuid],
        x: capturedObjectRects[uuid].x + adjacentTargetX,
        y: capturedObjectRects[uuid].y + adjacentTargetY,
      };
      return result;
    }, {});

    setObjectRects({
      ...objectRects,
      ...updateModel,
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

  const onResizeStart = (object: QueueObjectType, rect: ResizerEvent): void => {
    startBatch();
    setObjectRects({
      ...objectRects,
      [object.uuid]: rect,
    });
  };

  const onResizeMove = (object: QueueObjectType, rect: ResizerEvent): void => {
    setObjectRects({
      ...objectRects,
      [object.uuid]: rect,
    });
  };

  const onResizeEnd = (object: QueueObjectType, rect: ResizerEvent): void => {
    setObjectRects({
      ...objectRects,
      [object.uuid]: rect,
    });
    endBatch();
  };

  const onRotateStart = (object: QueueObjectType, rotate: ResizerEvent): void => {
    startBatch();
  };

  const onRotateMove = (object: QueueObjectType, rotate: ResizerEvent): void => {
    setObjectRotates({
      ...objectRotates,
      [object.uuid]: rotate,
    });
  };

  const onRotateEnd = (object: QueueObjectType, rotate: ResizerEvent): void => {
    setObjectRotates({
      ...objectRotates,
      [object.uuid]: rotate,
    });
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
    setQueueDocument.updateObjectProp(settings.queuePage, [
      {
        uuid: object.uuid,
        queueIndex: settings.queueIndex,
        props: {
          text: {
            text: {
              ...object.text,
              text,
            },
          },
        },
      },
    ]);
  };

  return (
    <QueueContextMenu.Root
      onOpenChange={(open): void => {
        if (open) {
          setSettings.setSelectedObjectUUIDs([]);
        }
      }}>
      <QueueContextMenu.Trigger ref={rootRef} className={clsx(styles.Root)}>
        <QueueScrollArea.Root className={clsx(styles.ScrollAreaRoot)}>
          <QueueScrollArea.Viewport className={clsx('flex')}>
            <Drawable
              scale={settings.scale}
              drawer={
                <div className={clsx(styles.drawer, 'w-full', 'h-full')}></div>
              }
              onDrawStart={onDrawStart}
              onDrawEnd={onDrawEnd}
              className={clsx(
                styles.Drawable,
                settings.presentationMode ? styles.fullscreen : ''
              )}>
              <Scaler
                width={queueDocument!.documentRect.width}
                height={queueDocument!.documentRect.height}
                scale={settings.scale}
                className={clsx(
                  settings.presentationMode ? styles.scaleFull : ''
                )}>
                <div
                  ref={canvasDiv}
                  className={clsx(styles.canvas, 'relative', 'box-border')}
                  style={{
                    width: queueDocument!.documentRect.width,
                    height: queueDocument!.documentRect.height,
                    background: queueDocument!.documentRect.fill,
                  }}>
                  {objects.map((object, index) => {
                    return (
                      <QueueContextMenu.Root
                        key={object.uuid}
                        onOpenChange={(open): void => {
                          if (
                            open &&
                            !settings.selectedObjectUUIDs.includes(object.uuid)
                          ) {
                            setSettings.setSelectedObjectUUIDs([object.uuid]);
                          }
                        }}>
                        <QueueContextMenu.Trigger>
                          <QueueObject.Container
                            className="queue-object-root"
                            object={object}
                            detail={
                              settings.selectionMode === 'detail' &&
                              settings.selectedObjectUUIDs.includes(object.uuid)
                            }
                            documentScale={settings.scale}
                            selected={settings.selectedObjectUUIDs.includes(
                              object.uuid
                            )}>
                            <QueueObject.Animator
                              queueIndex={settings.queueIndex}
                              queuePosition={settings.queuePosition}
                              queueStart={settings.queueStart}>
                              <QueueObject.Drag
                                onMousedown={(event): void =>
                                  onObjectMouseodown(event, object)
                                }
                                onDoubleClick={(event): void =>
                                  onObjectDoubleClick(event, object)
                                }
                                onDraggingStart={(): void => {
                                  onObjectDragStart();
                                }
                                }
                                onDraggingMove={(
                                  initEvent,
                                  currentEvent
                                ): void =>
                                  onObjectDragMove(
                                    initEvent,
                                    currentEvent,
                                  )
                                }
                                onDraggingEnd={onObjectDragEnd}>
                                <QueueObject.Rect></QueueObject.Rect>
                                <QueueObject.Text
                                  onEdit={(e): void =>
                                    onTextEdit(object, e)
                                  }></QueueObject.Text>
                                <QueueObject.Resizer
                                  onResizeStart={(event): void =>
                                    onResizeStart(object, event)
                                  }
                                  onResizeMove={(event): void =>
                                    onResizeMove(object, event)
                                  }
                                  onResizeEnd={(event): void =>
                                    onResizeEnd(object, event)
                                  }
                                  onRotateStart={(event): void =>
                                    onRotateStart(object, event)
                                  }
                                  onRotateMove={(event): void =>
                                    onRotateMove(object, event)
                                  }
                                  onRotateEnd={(event): void =>
                                    onRotateEnd(object, event)
                                  }></QueueObject.Resizer>
                              </QueueObject.Drag>
                            </QueueObject.Animator>
                          </QueueObject.Container>
                        </QueueContextMenu.Trigger>
                        <QueueContextMenu.Portal>
                          <QueueContextMenu.Content
                            onMouseDown={(e): void => e.stopPropagation()}>
                            <QueueContextMenu.Item
                              onClick={(): void =>
                                setQueueDocument.removeObjectOnQueue(
                                  settings.selectedObjectUUIDs
                                )
                              }>
                              현재 큐에서 삭제{' '}
                              <div className={styles.RightSlot}>Backspace</div>
                            </QueueContextMenu.Item>
                            <QueueContextMenu.Item
                              onClick={(): void =>
                                setQueueDocument.removeObject(
                                  settings.selectedObjectUUIDs
                                )
                              }>
                              오브젝트 삭제{' '}
                              <div className={styles.RightSlot}>
                                ⌘+Backspace
                              </div>
                            </QueueContextMenu.Item>
                            <QueueContextMenu.Separator />
                            <QueueContextMenu.Item>
                              잘라내기{' '}
                              <div className={styles.RightSlot}>⌘+T</div>
                            </QueueContextMenu.Item>
                            <QueueContextMenu.Item>
                              복사 <div className={styles.RightSlot}>⌘+C</div>
                            </QueueContextMenu.Item>
                            <QueueContextMenu.Separator />
                            <QueueContextMenu.Item
                              onClick={(): void =>
                                setQueueDocument.changeObjectIndex(
                                  settings.selectedObjectUUIDs,
                                  'start'
                                )
                              }>
                              맨 앞으로 가져오기
                            </QueueContextMenu.Item>
                            <QueueContextMenu.Item
                              onClick={(): void =>
                                setQueueDocument.changeObjectIndex(
                                  settings.selectedObjectUUIDs,
                                  'end'
                                )
                              }>
                              맨 뒤로 보내기
                            </QueueContextMenu.Item>
                            <QueueContextMenu.Item
                              onClick={(): void =>
                                setQueueDocument.changeObjectIndex(
                                  settings.selectedObjectUUIDs,
                                  'forward'
                                )
                              }>
                              앞으로 가져오기
                            </QueueContextMenu.Item>
                            <QueueContextMenu.Item
                              onClick={(): void =>
                                setQueueDocument.changeObjectIndex(
                                  settings.selectedObjectUUIDs,
                                  'backward'
                                )
                              }>
                              뒤로 보내기
                            </QueueContextMenu.Item>
                            <QueueContextMenu.Separator />
                            <QueueContextMenu.Item>그룹</QueueContextMenu.Item>
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
                                  alignOffset={-5}>
                                  <QueueContextMenu.Item>
                                    Save Page As…{' '}
                                    <div className={styles.RightSlot}>⌘+S</div>
                                  </QueueContextMenu.Item>
                                  <QueueContextMenu.Item>
                                    Create Shortcut…
                                  </QueueContextMenu.Item>
                                  <QueueContextMenu.Item>
                                    Name Window…
                                  </QueueContextMenu.Item>
                                  <QueueContextMenu.Separator />
                                  <QueueContextMenu.Item>
                                    Developer Tools
                                  </QueueContextMenu.Item>
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
        <QueueContextMenu.Content>
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
