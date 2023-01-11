import {
  createContext,
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { useRecoilState } from 'recoil';
import { documentSettingsState } from '../../store/settings';
import {
  QueueEditor,
  QueueEditorRef,
  RectUpdateModel,
} from '../../components/editor/Editor';
import { LeftPanel } from '../left-panel/LeftPanel';
import { RightPanel } from '../right-panel/RightPanel';
import { QueueSubtoolbar } from '../subtoolbar/Subtoolbar';
import { QueueToolbar } from '../toolbar/Toolbar';
import { documentState } from '../../store/document';
import styles from './RootLayout.module.scss';

export const RootContext = createContext({});

export const RootLayout: FunctionComponent<{ children?: ReactNode }> = (
  props
) => {
  const editorRef = useRef<QueueEditorRef>(null);
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const [settings, setSettings] = useRecoilState(documentSettingsState);

  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && settings.presentationMode) {
        setSettings({ ...settings, presentationMode: false });
      }
    });
  }, [settings, setSettings]);

  const onObjectRectUpdate = (models: RectUpdateModel[]): void => {
    const newObjects = queueDocument.objects.map((object) => {
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
      } else if (moveEffectIndex !== -1) {
        slicedObject.effects[moveEffectIndex] = {
          ...slicedObject.effects[moveEffectIndex],
          type: 'move',
          rect: {
            ...model.rect,
          },
        };
      } else {
        slicedObject.effects.push({
          type: 'move',
          index: model.queueIndex,
          duration: 1000,
          rect: {
            ...model.rect,
          },
        });
        slicedObject.effects.sort((a, b) => a.index - b.index);
      }
      return slicedObject;
    });
    console.log(queueDocument);
    setQueueDocument({ ...queueDocument, objects: newObjects });
    return;
  };

  return (
    <RootContext.Provider value={{}}>
      <div className={styles.container}>
        {!settings.presentationMode ? (
          <>
            <QueueToolbar></QueueToolbar>
            <QueueSubtoolbar
              onNextQueueClick={(): void => editorRef.current?.animate()}
              onPreviousQueueClick={(): void => editorRef.current?.animate()}
            ></QueueSubtoolbar>
          </>
        ) : null}
        <div className={styles.bottom}>
          {!settings.presentationMode ? <LeftPanel></LeftPanel> : null}
          <QueueEditor
            ref={editorRef}
            queueIndex={settings.queueIndex}
            queuePosition={settings.queuePosition}
            documentRect={queueDocument.documentRect}
            scale={settings.scale}
            objects={queueDocument.objects}
            onObjectRectUpdate={onObjectRectUpdate}
          ></QueueEditor>
          {!settings.presentationMode ? <RightPanel></RightPanel> : null}
        </div>
      </div>
    </RootContext.Provider>
  );
};
