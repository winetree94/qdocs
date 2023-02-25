import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { documentSettingsSlice } from 'store/settings/reducer';
import { NormalizedQueueObjectType, objectsSlice } from 'store/object/reducer';
import { DocumentSelectors } from 'store/document/selectors';
import { SettingSelectors } from 'store/settings/selectors';
import { QueueRect } from 'model/property';
import { effectSlice, NormalizedQueueEffect } from 'store/effect/reducer';
import { EffectSelectors } from 'store/effect/selectors';
import { MoveEffect, RotateEffect } from 'model/effect';
import { ObjectSelectors } from 'store/object/selectors';

export const QueueEditor = () => {
  const dispatch = useAppDispatch();

  const rootRef = useRef<HTMLSpanElement>(null);
  const canvasDiv = useRef<HTMLDivElement>(null);

  const queueDocument = useAppSelector(DocumentSelectors.document);
  const settings = useAppSelector(SettingSelectors.settings);
  const pageUUID = useAppSelector(SettingSelectors.currentPageUUID);
  const objects = useAppSelector((state) => ObjectSelectors.allByPageId(state, pageUUID));
  const effects = useAppSelector(EffectSelectors.all);

  const effectsGroupByObjectId = effects.reduce<{
    [uuid: string]: NormalizedQueueEffect[];
  }>((result, effect) => {
    if (!result[effect.objectId]) {
      result[effect.objectId] = [];
    }
    result[effect.objectId].push(effect);
    return result;
  }, {});

  const queueObjects = objects.filter((object) => {
    const createEffect = effectsGroupByObjectId[object.uuid].find((effect) => effect.type === 'create');
    const removeEffect = effectsGroupByObjectId[object.uuid].find((effect) => effect.type === 'remove');
    if (settings.queueIndex < createEffect.index) {
      return false;
    }
    if (removeEffect && settings.queueIndex > removeEffect.index) {
      return false;
    }
    return true;
  });

  const queueEffectsGroupByObjectId = effects
    .filter((effect) => effect.index === settings.queueIndex)
    .reduce<{
      [uuid: string]: NormalizedQueueEffect[];
    }>((result, effect) => {
      if (!result[effect.objectId]) {
        result[effect.objectId] = [];
      }
      result[effect.objectId].push(effect);
      return result;
    }, {});

  const props = useAppSelector(EffectSelectors.allEffectedObjectsMap);
  const [capturedObjectProps, setCapturedObjectProps] = useState<{ [key: string]: NormalizedQueueObjectType }>({});

  const canvasSizeToFit = useCallback((): void => {
    const root = rootRef.current!;
    const targetScale = Math.min(
      root.clientWidth / (queueDocument!.documentRect.width + 40),
      root.clientHeight / (queueDocument!.documentRect.height + 40),
    );
    if (settings.scale === targetScale) {
      return;
    }
    dispatch(documentSettingsSlice.actions.setScale(targetScale));
  }, [dispatch, queueDocument, settings]);

  // 최초 렌더링 시 스케일 계산
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => canvasSizeToFit(), []);

  useEventSelector(fitScreenSizeEvent, canvasSizeToFit);

  const onObjectMousedown = (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    object: NormalizedQueueObjectType,
  ): void => {
    event.stopPropagation();
    const selected = settings.selectedObjectUUIDs.includes(object.uuid);
    if (!event.shiftKey && !selected) {
      dispatch(
        documentSettingsSlice.actions.setSelection({
          ...settings,
          selectionMode: 'normal',
          uuids: [object.uuid],
        }),
      );
    } else {
      dispatch(documentSettingsSlice.actions.addSelection(object.uuid));
    }
  };

  const onObjectDoubleClick = (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    object: NormalizedQueueObjectType,
  ): void => {
    event.stopPropagation();
    dispatch(
      documentSettingsSlice.actions.setSelection({
        selectionMode: 'detail',
        uuid: object.uuid,
      }),
    );
  };

  const onUpdateDrag = (initEvent: MouseEvent, event: MouseEvent): void => {
    const diffX = event.clientX - initEvent.clientX;
    const diffY = event.clientY - initEvent.clientY;
    const currentScale = 1 / settings.scale;

    const targetX = diffX * currentScale;
    const targetY = diffY * currentScale;
    const adjacentTargetX = event.shiftKey ? targetX : adjacent(targetX, 30);
    const adjacentTargetY = event.shiftKey ? targetY : adjacent(targetY, 30);

    const updateModel = settings.selectedObjectUUIDs.reduce<{
      objects: { id: string; changes: { rect: QueueRect } }[];
      effects: NormalizedQueueEffect[];
    }>(
      (result, uuid) => {
        if (queueEffectsGroupByObjectId[uuid]?.find((effect) => effect.type === 'create')) {
          result.objects.push({
            id: uuid,
            changes: {
              rect: {
                ...props[uuid].rect,
                x: capturedObjectProps[uuid].rect.x + adjacentTargetX,
                y: capturedObjectProps[uuid].rect.y + adjacentTargetY,
              },
            },
          });
        } else {
          const existRectEffect = queueEffectsGroupByObjectId[uuid]?.find(
            (effect) => effect.type === 'rect',
          ) as MoveEffect;
          result.effects.push({
            type: 'rect',
            duration: 1000,
            delay: 0,
            objectId: uuid,
            index: settings.queueIndex,
            timing: 'linear',
            ...existRectEffect,
            prop: {
              ...props[uuid].rect,
              x: capturedObjectProps[uuid].rect.x + adjacentTargetX,
              y: capturedObjectProps[uuid].rect.y + adjacentTargetY,
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
      dispatch(effectSlice.actions.upsertEffects(updateModel.effects));
    }
    if (updateModel.objects.length) {
      dispatch(objectsSlice.actions.updateObjects(updateModel.objects));
    }
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
    const absScale = 1 / settings.scale;
    const x = (event.drawClientX - rect.x) * absScale;
    const y = (event.drawClientY - rect.y) * absScale;
    const width = event.width * absScale;
    const height = event.height * absScale;

    const rangeObjectUUIDs = Object.entries(props)
      .filter(([_, { rect }]) => {
        return rect.x >= x && rect.y >= y && rect.x + rect.width <= x + width && rect.y + rect.height <= y + height;
      })
      .map(([uuid]) => uuid);

    dispatch(
      documentSettingsSlice.actions.setSelection({
        selectionMode: 'normal',
        uuids: rangeObjectUUIDs,
      }),
    );
  };

  const resizeObjectRect = (uuid: string, rect: ResizerEvent): void => {
    if (queueEffectsGroupByObjectId[uuid]?.find((effect) => effect.type === 'create')) {
      dispatch(
        objectsSlice.actions.updateObject({
          id: uuid,
          changes: {
            rect: {
              ...props[uuid].rect,
              ...rect,
            },
          },
        }),
      );
    } else {
      const existRectEffect = queueEffectsGroupByObjectId[uuid]?.find((effect) => effect.type === 'rect') as MoveEffect;
      dispatch(
        effectSlice.actions.upsertEffect({
          type: 'rect',
          duration: 1000,
          delay: 0,
          objectId: uuid,
          timing: 'linear',
          index: settings.queueIndex,
          ...existRectEffect,
          prop: {
            ...props[uuid].rect,
            ...rect,
          },
        }),
      );
    }
  };

  const updateObjectRotate = (uuid: string, degree: number): void => {
    if (queueEffectsGroupByObjectId[uuid]?.find((effect) => effect.type === 'create')) {
      dispatch(
        objectsSlice.actions.updateObject({
          id: uuid,
          changes: {
            rotate: {
              degree: degree,
            },
          },
        }),
      );
    } else {
      const existRotateEffect = queueEffectsGroupByObjectId[uuid]?.find(
        (effect) => effect.type === 'rotate',
      ) as RotateEffect;
      dispatch(
        effectSlice.actions.upsertEffect({
          type: 'rotate',
          duration: 1000,
          delay: 0,
          objectId: uuid,
          timing: 'linear',
          index: settings.queueIndex,
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
      document.body.clientWidth / queueDocument!.documentRect.width,
      document.body.clientHeight / queueDocument!.documentRect.height,
    );
    if (settings.scale === scale) {
      return;
    }
    dispatch(documentSettingsSlice.actions.setScale(scale));
  }, [dispatch, queueDocument, settings.scale]);

  useEffect(() => {
    if (!settings.presentationMode) {
      return;
    }
    const observer = new ResizeObserver(maximizeScale);
    observer.observe(document.body);
    maximizeScale();
    return () => observer.disconnect();
  }, [dispatch, maximizeScale, queueDocument, settings.presentationMode, settings.scale]);

  const onTextEdit = (object: NormalizedQueueObjectType, text: string): void => {
    dispatch(
      objectsSlice.actions.updateObject({
        id: object.uuid,
        changes: {
          text: {
            ...object.text,
            text,
          },
        },
      }),
    );
  };

  const onObjectContextMenuOpenChange = (uuid: string, open: boolean): void => {
    if (open && !settings.selectedObjectUUIDs.includes(uuid)) {
      dispatch(
        documentSettingsSlice.actions.setSelection({
          selectionMode: 'normal',
          uuids: [uuid],
        }),
      );
    }
  };

  return (
    <QueueContextMenu.Root>
      <QueueContextMenu.Trigger ref={rootRef} className={clsx(styles.Root)}>
        <QueueScrollArea.Root
          className={clsx(styles.ScrollAreaRoot)}
          onMouseDown={() => dispatch(documentSettingsSlice.actions.resetSelection())}>
          <QueueScrollArea.Viewport className={clsx('flex')}>
            <Drawable
              scale={settings.scale}
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
                  {queueObjects.map((object) => (
                    <QueueContextMenu.Root
                      key={object.uuid}
                      onOpenChange={(open): void => onObjectContextMenuOpenChange(object.uuid, open)}>
                      <QueueContextMenu.Trigger>
                        <QueueObject.Container
                          object={object}
                          detail={
                            settings.selectionMode === 'detail' && settings.selectedObjectUUIDs.includes(object.uuid)
                          }
                          documentScale={settings.scale}
                          selected={settings.selectedObjectUUIDs.includes(object.uuid)}>
                          <QueueObject.Animator
                            queueIndex={settings.queueIndex}
                            queuePosition={settings.queuePosition}
                            queueStart={settings.queueStart}>
                            <QueueObject.Drag
                              onMousedown={(e) => onObjectMousedown(e, object)}
                              onDoubleClick={(e) => onObjectDoubleClick(e, object)}
                              onDraggingStart={() => setCapturedObjectProps(props)}
                              onDraggingMove={onObjectDragMove}
                              onDraggingEnd={onObjectDragEnd}>
                              <QueueObject.Rect></QueueObject.Rect>
                              <QueueObject.Text onEdit={(e) => onTextEdit(object, e)} />
                              <QueueObject.Resizer
                                onResizeStart={(e) => resizeObjectRect(object.uuid, e)}
                                onResizeMove={(e) => resizeObjectRect(object.uuid, e)}
                                onResizeEnd={(e) => resizeObjectRect(object.uuid, e)}
                                onRotateMove={(e) => updateObjectRotate(object.uuid, e.degree)}
                                onRotateEnd={(e) => updateObjectRotate(object.uuid, e.degree)}
                              />
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
            </Drawable>
            {settings.presentationMode && <PresentationRemote />}
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
