import { memo, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { Drawable, DrawEvent } from '../../cdk/draw/Draw';
import { Scaler } from '../scaler/Scaler';
import { QueueObject } from '@legacy/components/queue';
import { QueueContextMenu } from '@legacy/components/context-menu/Context';
import clsx from 'clsx';
import styles from './Editor.module.scss';
import { QueueScrollArea } from '@legacy/components/scroll-area/ScrollArea';
import { ResizerEvent } from '@legacy/components/queue/Resizer';
import { adjacent } from '@legacy/cdk/math/adjacent';
import { EditorContext } from './EditorContext';
import { PresentationRemote } from './PresentationRemote';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { useEventSelector } from '@legacy/cdk/hooks/event-dispatcher';
import { fitScreenSizeEvent } from '@legacy/app/events/event';
import { DocumentSelectors } from '@legacy/store/document/selectors';
import { SettingSelectors } from '@legacy/store/settings/selectors';
import { QueueRect } from '@legacy/model/property';
import {
  RectEffect,
  RotateEffect,
  QueueEffectType,
} from '@legacy/model/effect';
import { EffectActions } from '../../store/effect';
import { EntityId } from '@reduxjs/toolkit';
import { SettingsActions } from '../../store/settings';
import { ObjectActions } from '../../store/object';
import { Draggable } from '@legacy/cdk/drag/Drag';
import { isEqual } from 'lodash';
import { HistoryActions } from '@legacy/store/history';
import { QueueObjectType } from '@legacy/model/object';
import { store } from '@legacy/store';

export interface QueueEditorProps {
  className?: string;
}

export const QueueEditor = memo((props: QueueEditorProps) => {
  const dispatch = useAppDispatch();

  const rootRef = useRef<HTMLSpanElement>(null);
  const canvasDiv = useRef<HTMLDivElement>(null);

  const documentRect = useAppSelector(DocumentSelectors.documentRect);
  const documentId = useAppSelector(DocumentSelectors.documentId);
  const pageId = useAppSelector(SettingSelectors.pageId);
  const currentQueueIndex = useAppSelector(SettingSelectors.queueIndex);
  const queueStart = useAppSelector(SettingSelectors.queueStart);
  const autoPlay = useAppSelector(SettingSelectors.autoPlay);
  const autoPlayRepeat = useAppSelector(SettingSelectors.autoPlayRepeat);
  const currentScale = useAppSelector(SettingSelectors.scale);
  const selectedObjectIds = useAppSelector(SettingSelectors.selectedObjectIds);
  const presentationMode = useAppSelector(SettingSelectors.presentationMode);
  const queuePosition = useAppSelector(SettingSelectors.queuePosition);
  const selectionMode = useAppSelector(SettingSelectors.selectionMode);

  const queueObjects = useAppSelector(SettingSelectors.currentVisibleObjects);
  const queueEffectsGroupByObjectId = useAppSelector(
    SettingSelectors.currentPageQueueIndexEffectsByObjectId,
  );
  const maxEffectTime = useAppSelector(
    SettingSelectors.currentPageQueueIndexMaxDuration,
  );

  const currentTick = useRef<number>(0);

  const capturedObjectProps = useRef<{
    [key: string]: QueueObjectType;
  }>({});

  const autoplayCallback = useCallback(
    (time: number) => {
      if (time - queueStart > maxEffectTime) {
        dispatch(SettingsActions.forward({ repeat: autoPlayRepeat }));
        return;
      }
      currentTick.current = requestAnimationFrame(autoplayCallback);
    },
    [dispatch, maxEffectTime, autoPlayRepeat, queueStart],
  );

  useEffect(() => {
    if (!autoPlay) {
      return;
    }
    currentTick.current = requestAnimationFrame(autoplayCallback);
    return () => cancelAnimationFrame(currentTick.current);
  }, [queueStart, maxEffectTime, autoplayCallback, autoPlay]);

  const canvasSizeToFit = useCallback((): void => {
    const root = rootRef.current;
    const targetScale = Math.min(
      root.clientWidth / (documentRect.width + 100),
      root.clientHeight / (documentRect.height + 100),
    );
    if (currentScale === targetScale) {
      return;
    }
    dispatch(SettingsActions.setScale(targetScale));
  }, [dispatch, documentRect, currentScale]);

  // 최초 렌더링 시 스케일 계산
  useLayoutEffect(() => canvasSizeToFit(), [documentId]);

  useEventSelector(fitScreenSizeEvent, canvasSizeToFit);

  /**
   * @description
   * 빈 공간을 클릭했을 때, 선택된 오브젝트 해제
   */
  const onRootMousedown = () => {
    if (selectedObjectIds.length === 0) {
      return;
    }
    dispatch(SettingsActions.resetSelection());
  };

  const onObjectMousedown = (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    object: QueueObjectType,
  ): void => {
    event.stopPropagation();
    const selected = selectedObjectIds.includes(object.id);
    if (!event.shiftKey && !selected) {
      dispatch(
        SettingsActions.setSelection({
          selectionMode: 'normal',
          ids: [object.id],
        }),
      );
    } else if (!selected) {
      dispatch(SettingsActions.addSelection(object.id));
    }
  };

  const onObjectDoubleClick = (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    object: QueueObjectType,
  ): void => {
    event.stopPropagation();
    dispatch(
      SettingsActions.setSelection({
        selectionMode: 'detail',
        id: object.id,
      }),
    );
  };

  const onUpdateDrag = (initEvent: MouseEvent, event: MouseEvent): void => {
    const props = SettingSelectors.allEffectedObjectsMap(store.getState());
    const diffX = event.clientX - initEvent.clientX;
    const diffY = event.clientY - initEvent.clientY;
    const currentScaleFactor = 1 / currentScale;

    const targetX = diffX * currentScaleFactor;
    const targetY = diffY * currentScaleFactor;
    const adjacentTargetX = event.shiftKey ? targetX : adjacent(targetX, 30);
    const adjacentTargetY = event.shiftKey ? targetY : adjacent(targetY, 30);

    const updateModel = selectedObjectIds.reduce<{
      objects: { id: EntityId; changes: { rect: QueueRect } }[];
      effects: QueueEffectType[];
    }>(
      (result, id) => {
        if (
          queueEffectsGroupByObjectId[id]?.find(
            (effect) => effect.type === 'create',
          )
        ) {
          result.objects.push({
            id: id,
            changes: {
              rect: {
                ...props[id].rect,
                x: capturedObjectProps.current[id].rect.x + adjacentTargetX,
                y: capturedObjectProps.current[id].rect.y + adjacentTargetY,
              },
            },
          });
        } else {
          const existRectEffect = queueEffectsGroupByObjectId[id]?.find(
            (effect) => effect.type === 'rect',
          );
          result.effects.push({
            type: 'rect',
            duration: 1000,
            delay: 0,
            objectId: id,
            index: currentQueueIndex,
            timing: 'linear',
            pageId: pageId,
            ...existRectEffect,
            prop: {
              ...props[id].rect,
              x: capturedObjectProps.current[id].rect.x + adjacentTargetX,
              y: capturedObjectProps.current[id].rect.y + adjacentTargetY,
            },
          });
        }
        return result;
      },
      {
        objects: [],
        effects: [],
      },
    );

    if (updateModel.effects.length) {
      dispatch(EffectActions.upsertEffects(updateModel.effects));
    }
    if (updateModel.objects.length) {
      dispatch(ObjectActions.updateObjects(updateModel.objects));
    }
  };

  const onObjectDragStart = (): void => {
    const props = SettingSelectors.allEffectedObjectsMap(store.getState());
    capturedObjectProps.current = { ...props };
    dispatch(HistoryActions.Capture());
  };

  const onObjectDragMove = (initEvent: MouseEvent, event: MouseEvent): void => {
    onUpdateDrag(initEvent, event);
  };

  const onObjectDragEnd = (initEvent: MouseEvent, event: MouseEvent): void => {
    onUpdateDrag(initEvent, event);
  };

  /**
   * @description
   * 드로잉 종료 시 범위 내 오브젝트를 선택
   */
  const onDrawEnd = (event: DrawEvent): void => {
    if (!canvasDiv.current) {
      return;
    }
    const props = SettingSelectors.allEffectedObjectsMap(store.getState());
    const rect = canvasDiv.current.getBoundingClientRect();
    const absScale = 1 / currentScale;
    const x = (event.clientX - rect.x) * absScale;
    const y = (event.clientY - rect.y) * absScale;
    const width = event.width * absScale;
    const height = event.height * absScale;

    const rangeObjectIds = Object.entries(props)
      .filter(([_, { rect }]) => {
        return (
          rect.x >= x &&
          rect.y >= y &&
          rect.x + rect.width <= x + width &&
          rect.y + rect.height <= y + height
        );
      })
      .map(([id]) => id);

    if (isEqual(rangeObjectIds, selectedObjectIds)) {
      return;
    }

    dispatch(
      SettingsActions.setSelection({
        selectionMode: 'normal',
        ids: rangeObjectIds,
      }),
    );
  };

  const resizeObjectRect = (id: EntityId, rect: ResizerEvent): void => {
    const props = SettingSelectors.allEffectedObjectsMap(store.getState());
    if (
      queueEffectsGroupByObjectId[id]?.find(
        (effect) => effect.type === 'create',
      )
    ) {
      dispatch(
        ObjectActions.updateObject({
          id: id,
          changes: {
            rect: {
              ...props[id].rect,
              ...rect,
            },
          },
        }),
      );
    } else {
      const existRectEffect = queueEffectsGroupByObjectId[id]?.find(
        (effect) => effect.type === 'rect',
      );
      dispatch(
        EffectActions.upsertEffect({
          type: 'rect',
          duration: 1000,
          delay: 0,
          objectId: id,
          timing: 'linear',
          pageId: pageId,
          index: currentQueueIndex,
          ...existRectEffect,
          prop: {
            ...props[id].rect,
            ...rect,
          },
        }),
      );
    }
  };

  const updateObjectRotate = (id: EntityId, degree: number): void => {
    if (
      queueEffectsGroupByObjectId[id]?.find(
        (effect) => effect.type === 'create',
      )
    ) {
      dispatch(
        ObjectActions.updateObject({
          id: id,
          changes: {
            rotate: {
              degree: degree,
            },
          },
        }),
      );
    } else {
      const existRotateEffect = queueEffectsGroupByObjectId[id]?.find(
        (effect) => effect.type === 'rotate',
      );
      dispatch(
        EffectActions.upsertEffect({
          type: 'rotate',
          duration: 1000,
          delay: 0,
          objectId: id,
          timing: 'linear',
          pageId: pageId,
          index: currentQueueIndex,
          ...existRotateEffect,
          prop: {
            degree: degree,
          },
        }),
      );
    }
  };

  const maximizeScale = useCallback(() => {
    const scale = Math.min(
      document.body.clientWidth / documentRect.width,
      document.body.clientHeight / documentRect.height,
    );
    if (currentScale === scale) {
      return;
    }
    dispatch(SettingsActions.setScale(scale));
  }, [dispatch, documentRect, currentScale]);

  useEffect(() => {
    if (!presentationMode) {
      return;
    }
    const observer = new ResizeObserver(maximizeScale);
    observer.observe(document.body);
    maximizeScale();
    return () => observer.disconnect();
  }, [dispatch, maximizeScale, documentRect, presentationMode, currentScale]);

  const onTextEdit = (object: QueueObjectType, text: string): void => {
    dispatch(
      ObjectActions.updateObject({
        id: object.id,
        changes: {
          text: {
            ...object.text,
            text,
          },
        },
      }),
    );
  };

  const onObjectContextMenuOpenChange = (id: EntityId, open: boolean): void => {
    if (open && !selectedObjectIds.includes(id)) {
      dispatch(
        SettingsActions.setSelection({
          selectionMode: 'normal',
          ids: [id],
        }),
      );
    }
  };

  useEffect(() => {
    const onWheel = (event: WheelEvent): void => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }
      event.preventDefault();
      const scale = Math.max(
        0.1,
        Math.min(10, currentScale - event.deltaY * 0.001),
      );
      if (currentScale === scale) {
        return;
      }
      dispatch(SettingsActions.setScale(scale));
    };
    rootRef.current?.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      return rootRef.current?.removeEventListener('wheel', onWheel);
    };
  }, [dispatch, currentScale, documentRect.width, documentRect.height]);

  return (
    <QueueContextMenu.Root>
      <QueueContextMenu.Trigger
        ref={rootRef}
        className={clsx(styles.Root, props.className)}>
        <QueueScrollArea.Root
          className={clsx(styles.ScrollAreaRoot)}
          onMouseDown={onRootMousedown}>
          <QueueScrollArea.Viewport className={clsx('tw-flex')}>
            <Drawable
              onDrawEnd={onDrawEnd}
              className={clsx(
                styles.Drawable,
                presentationMode ? styles.fullscreen : '',
              )}>
              <Scaler
                width={documentRect.width}
                height={documentRect.height}
                scale={currentScale}
                className={clsx(presentationMode ? styles.scaleFull : '')}>
                <div
                  ref={canvasDiv}
                  className={clsx(
                    styles.canvas,
                    presentationMode ? styles.fullscreen : '',
                  )}
                  style={{
                    width: documentRect.width,
                    height: documentRect.height,
                    background: documentRect.fill,
                  }}>
                  {queueObjects.map((object) => (
                    <QueueContextMenu.Root
                      key={object.id}
                      onOpenChange={(open): void =>
                        onObjectContextMenuOpenChange(object.id, open)
                      }>
                      <QueueContextMenu.Trigger>
                        <QueueObject.Container
                          object={object}
                          detail={
                            selectionMode === 'detail' &&
                            selectedObjectIds.includes(object.id)
                          }
                          documentScale={currentScale}
                          selected={selectedObjectIds.includes(object.id)}>
                          <QueueObject.Animator
                            queueIndex={currentQueueIndex}
                            queuePosition={queuePosition}
                            queueStart={queueStart}>
                            <Draggable
                              onMouseDown={(e) => onObjectMousedown(e, object)}
                              onDoubleClick={(e) =>
                                onObjectDoubleClick(e, object)
                              }
                              onActualDragStart={() => onObjectDragStart()}
                              onActualDragMove={onObjectDragMove}
                              onActualDragEnd={onObjectDragEnd}>
                              <QueueObject.Rect></QueueObject.Rect>
                              <QueueObject.Text
                                onEdit={(e) => onTextEdit(object, e)}
                              />
                              <QueueObject.Resizer
                                onResizeStart={(e) => {
                                  dispatch(HistoryActions.Capture());
                                  resizeObjectRect(object.id, e);
                                }}
                                onResizeMove={(e) =>
                                  resizeObjectRect(object.id, e)
                                }
                                onResizeEnd={(e) =>
                                  resizeObjectRect(object.id, e)
                                }
                                onRotateStart={(e) =>
                                  dispatch(HistoryActions.Capture())
                                }
                                onRotateMove={(e) =>
                                  updateObjectRotate(object.id, e.degree)
                                }
                                onRotateEnd={(e) =>
                                  updateObjectRotate(object.id, e.degree)
                                }
                              />
                            </Draggable>
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
            </Drawable>
            {presentationMode && <PresentationRemote />}
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
});
