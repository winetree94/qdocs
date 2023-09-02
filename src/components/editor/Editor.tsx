import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Drawable, DrawEvent } from '../../cdk/draw/Draw';
import { Scaler } from '../scaler/Scaler';
import { QueueObject } from 'components/queue';
import { QueueContextMenu } from 'components/context-menu/Context';
import clsx from 'clsx';
import styles from './Editor.module.scss';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { ResizerEvent } from 'components/queue/Resizer';
import { adjacent } from 'cdk/math/adjacent';
import { EditorContext } from './EditorContext';
import { PresentationRemote } from './PresentationRemote';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useEventSelector } from 'cdk/hooks/event-dispatcher';
import { fitScreenSizeEvent } from 'app/events/event';
import { DocumentSelectors } from 'store/document/selectors';
import { SettingSelectors } from 'store/settings/selectors';
import { QueueRect } from 'model/property';
import { EffectSelectors } from 'store/effect/selectors';
import { RectEffect, RotateEffect, QueueEffectType } from 'model/effect';
import { ObjectSelectors } from 'store/object/selectors';
import { EffectActions } from '../../store/effect';
import { EntityId } from '@reduxjs/toolkit';
import { SettingsActions } from '../../store/settings';
import { ObjectActions } from '../../store/object';
import { Draggable } from 'cdk/drag/Drag';
import { isEqual } from 'lodash';
import { HistoryActions } from 'store/history';
import { QueueObjectType } from 'model/object';

export const QueueEditor = () => {
  const dispatch = useAppDispatch();

  const rootRef = useRef<HTMLSpanElement>(null);
  const canvasDiv = useRef<HTMLDivElement>(null);

  const documentId = useAppSelector(SettingSelectors.documentId);
  const queueDocument = useAppSelector(DocumentSelectors.document);
  const currentQueueIndex = useAppSelector(SettingSelectors.queueIndex);
  const currentPageId = useAppSelector(SettingSelectors.pageId);
  const queueStart = useAppSelector(SettingSelectors.queueStart);
  const autoPlay = useAppSelector(SettingSelectors.autoPlay);
  const autoPlayRepeat = useAppSelector(SettingSelectors.autoPlayRepeat);
  const currentScale = useAppSelector(SettingSelectors.scale);
  const selectedObjectIds = useAppSelector(SettingSelectors.selectedObjectIds);
  const presentationMode = useAppSelector(SettingSelectors.presentationMode);
  const queuePosition = useAppSelector(SettingSelectors.queuePosition);
  const selectionMode = useAppSelector(SettingSelectors.selectionMode);

  const objects = useAppSelector((state) =>
    ObjectSelectors.allByPageId(state, currentPageId),
  );
  const effects = useAppSelector(EffectSelectors.all);
  const props = useAppSelector(EffectSelectors.allEffectedObjectsMap);

  const [capturedObjectProps, setCapturedObjectProps] = useState<{
    [key: string]: QueueObjectType;
  }>({});

  const effectsGroupByObjectId = effects.reduce<{
    [id: string]: QueueEffectType[];
  }>((result, effect) => {
    if (!result[effect.objectId]) {
      result[effect.objectId] = [];
    }
    result[effect.objectId].push(effect);
    return result;
  }, {});

  const queueObjects = objects.filter((object) => {
    const createEffect = (effectsGroupByObjectId[object.id] || []).find(
      (effect) => effect.type === 'create',
    );
    const removeEffect = (effectsGroupByObjectId[object.id] || []).find(
      (effect) => effect.type === 'remove',
    );
    if (!createEffect) {
      return false;
    }
    if (currentQueueIndex < createEffect.index) {
      return false;
    }
    if (removeEffect && currentQueueIndex > removeEffect.index) {
      return false;
    }
    return true;
  });

  const currentQueueEffects = effects.filter(
    (effect) => effect.index === currentQueueIndex,
  );

  const queueEffectsGroupByObjectId = currentQueueEffects.reduce<{
    [id: string]: QueueEffectType[];
  }>((result, effect) => {
    if (!result[effect.objectId]) {
      result[effect.objectId] = [];
    }
    result[effect.objectId].push(effect);
    return result;
  }, {});

  const maxEffectTime = Math.max(
    ...currentQueueEffects.map((effect) => effect.duration + effect.delay),
    0,
  );

  const currentTick = useRef<number>(0);

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
      root.clientWidth / (queueDocument.documentRect.width + 40),
      root.clientHeight / (queueDocument.documentRect.height + 40),
    );
    if (currentScale === targetScale) {
      return;
    }
    dispatch(SettingsActions.setScale(targetScale));
  }, [dispatch, queueDocument, currentScale]);

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
                x: capturedObjectProps[id].rect.x + adjacentTargetX,
                y: capturedObjectProps[id].rect.y + adjacentTargetY,
              },
            },
          });
        } else {
          const existRectEffect = queueEffectsGroupByObjectId[id]?.find(
            (effect) => effect.type === 'rect',
          ) as RectEffect;
          result.effects.push({
            type: 'rect',
            duration: 1000,
            delay: 0,
            objectId: id,
            index: currentQueueIndex,
            timing: 'linear',
            ...existRectEffect,
            prop: {
              ...props[id].rect,
              x: capturedObjectProps[id].rect.x + adjacentTargetX,
              y: capturedObjectProps[id].rect.y + adjacentTargetY,
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
    setCapturedObjectProps(props);
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
      ) as RectEffect;
      dispatch(
        EffectActions.upsertEffect({
          type: 'rect',
          duration: 1000,
          delay: 0,
          objectId: id,
          timing: 'linear',
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
      ) as RotateEffect;
      dispatch(
        EffectActions.upsertEffect({
          type: 'rotate',
          duration: 1000,
          delay: 0,
          objectId: id,
          timing: 'linear',
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
      document.body.clientWidth / queueDocument.documentRect.width,
      document.body.clientHeight / queueDocument.documentRect.height,
    );
    if (currentScale === scale) {
      return;
    }
    dispatch(SettingsActions.setScale(scale));
  }, [dispatch, queueDocument, currentScale]);

  useEffect(() => {
    if (!presentationMode) {
      return;
    }
    const observer = new ResizeObserver(maximizeScale);
    observer.observe(document.body);
    maximizeScale();
    return () => observer.disconnect();
  }, [dispatch, maximizeScale, queueDocument, presentationMode, currentScale]);

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
    return () => rootRef.current?.removeEventListener('wheel', onWheel);
  }, [
    dispatch,
    currentScale,
    queueDocument.documentRect.width,
    queueDocument.documentRect.height,
  ]);

  return (
    <QueueContextMenu.Root>
      <QueueContextMenu.Trigger ref={rootRef} className={clsx(styles.Root)}>
        <QueueScrollArea.Root className={clsx(styles.ScrollAreaRoot)}>
          <QueueScrollArea.Viewport className={clsx('tw-flex')}>
            <Drawable
              onDrawEnd={onDrawEnd}
              className={clsx(
                styles.Drawable,
                presentationMode ? styles.fullscreen : '',
              )}>
              <Scaler
                width={queueDocument.documentRect.width}
                height={queueDocument.documentRect.height}
                scale={currentScale}
                className={clsx(presentationMode ? styles.scaleFull : '')}>
                <div
                  ref={canvasDiv}
                  className={clsx(
                    styles.canvas,
                    presentationMode ? styles.fullscreen : '',
                  )}
                  style={{
                    width: queueDocument.documentRect.width,
                    height: queueDocument.documentRect.height,
                    background: queueDocument.documentRect.fill,
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
};
