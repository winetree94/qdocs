import { debounce } from 'cdk/functions/debounce';
import clsx from 'clsx';
import { Slider } from 'components';
import { QueueObjectType } from 'model/document';
import {
  createContext,
  FormEvent,
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useContext,
} from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { documentState } from 'store/document';
import { documentSettingsState } from 'store/settings';
import classes from './RightPanel.module.scss';

// context start
interface ObjectStylerContextValue {
  objects: QueueObjectType[];
}

const ObjectStylerContext = createContext<ObjectStylerContextValue | null>(
  null
);

const useObjectStylerContext = (): ObjectStylerContextValue => {
  const context = useContext(ObjectStylerContext);

  if (!context) {
    throw new Error('useObjectStylerContext Provider not found!');
  }

  return context;
};
// context end

// ------------- styler start -------------
type ObjectStylerElementProps = HTMLAttributes<HTMLDivElement>;
type StyleChangeValue = { [k: string]: FormDataEntryValue };
interface ObjectStylerProps extends PropsWithChildren {
  objects: QueueObjectType[];
  onStyleChange?: (value: StyleChangeValue) => void;
}

const ObjectStyler = ({
  children,
  objects,
  onStyleChange,
}: ObjectStylerProps): ReactElement => {
  const handleStyleChange = (event: FormEvent<HTMLFormElement>): void => {
    const formData = new FormData(event.currentTarget);

    onStyleChange?.(Object.fromEntries(formData));
  };

  return (
    <ObjectStylerContext.Provider value={{ objects }}>
      <form onChange={handleStyleChange}>{children}</form>
    </ObjectStylerContext.Provider>
  );
};

const ObjectStylerEffectList = ({
  ...props
}: ObjectStylerElementProps): ReactElement => {
  const { objects } = useObjectStylerContext();
  const [firstObject] = objects;

  return (
    <div {...props}>
      <p>Object effects</p>
      <ul className={classes['scroll-list-box']}>
        {firstObject.effects.map((effect, index) => (
          <li key={`effect-${index}`}>
            <span># {effect.index + 1} </span>
            <span>{effect.type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ObjectStylerCurrentQueueEffect = ({
  ...props
}: ObjectStylerElementProps): ReactElement => {
  const settings = useRecoilValue(documentSettingsState);
  const { objects } = useObjectStylerContext();
  const [firstObject] = objects;
  const currentQueueObjectEffects = firstObject.effects.filter(
    (effect) => effect.index === settings.queueIndex
  );
  return (
    <div {...props}>
      <p>Current queue effecs</p>
      <ul className={classes['scroll-list-box']}>
        {currentQueueObjectEffects.map((currentQueueObjectEffect) => (
          <li key={currentQueueObjectEffect.type}>
            {currentQueueObjectEffect.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ObjectStylerBackgroundColor = (): ReactElement => {
  const { objects } = useObjectStylerContext();
  const [firstObject] = objects;

  return (
    <div>
      <label>
        <span>background color</span>
        <input
          type="color"
          name="backgroundColor"
          id="backgroundColor"
          defaultValue={firstObject.fill.color}
        />
      </label>
    </div>
  );
};

const ObjectStylerStrokeColor = (): ReactElement => {
  const { objects } = useObjectStylerContext();
  const [firstObject] = objects;

  return (
    <div>
      <label>
        <span>border color</span>
        <input
          type="color"
          name="strokeColor"
          id="strokeColor"
          defaultValue={firstObject.stroke.color}
        />
      </label>
    </div>
  );
};

const ObjectStylerStrokeWidth = (): ReactElement => {
  const { objects } = useObjectStylerContext();
  const [firstObject] = objects;

  return (
    <div>
      <label>
        <span>border width</span>
        <Slider
          name="strokeWidth"
          min={0}
          max={100}
          defaultValue={[firstObject.stroke.width]}
        />
      </label>
    </div>
  );
};

const ObjectStylerOpacity = (): ReactElement => {
  const { objects } = useObjectStylerContext();
  const [firstObject] = objects;

  return (
    <div>
      <label>
        <span>opacity</span>
        <Slider
          name="opacity"
          min={0}
          max={1}
          step={0.1}
          defaultValue={[firstObject.fade.opacity]}
        />
      </label>
    </div>
  );
};

ObjectStyler.EffectList = ObjectStylerEffectList;
ObjectStyler.CurrentQueueEffect = ObjectStylerCurrentQueueEffect;
ObjectStyler.BackgroundColor = ObjectStylerBackgroundColor;
ObjectStyler.StrokeColor = ObjectStylerStrokeColor;
ObjectStyler.StrokeWidth = ObjectStylerStrokeWidth;
ObjectStyler.Opacity = ObjectStylerOpacity;
// ------------- styler end -------------

export const RightPanel = ({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>): ReactElement | null => {
  const settings = useRecoilValue(documentSettingsState);
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const selectedObjects = queueDocument!.objects.filter((object) =>
    settings.selectedObjectUUIDs.includes(object.uuid)
  );
  const hasSelectedObjects = selectedObjects.length > 0;

  const setDocumentHistory = useCallback(
    debounce(() => {
      console.log('history save');
    }, 500),
    []
  );

  const handleStyleChange = (value: StyleChangeValue): void => {
    const newObjects = queueDocument!.objects.map((object) => {
      if (!settings.selectedObjectUUIDs.includes(object.uuid)) {
        return object;
      }

      // 선택된 오브젝트 -> 변경되는 스타일 적용해야함
      const updatedModel = {
        ...object,
        fill: {
          ...object.fill,
          color: value.backgroundColor as string,
        },
        stroke: {
          ...object.stroke,
          color: value.strokeColor as string,
          width: parseInt(value.strokeWidth as string),
        },
        fade: {
          ...object.fade,
          opacity: parseFloat(value.opacity as string),
        },
      };

      return updatedModel;
    });

    setQueueDocument({ ...queueDocument!, objects: newObjects });
    setDocumentHistory();
  };

  return (
    <div
      id="right-panel-root"
      className={clsx(classes.root, className)}
      {...props}
    >
      {hasSelectedObjects && (
        <div className="p-2">
          <div>
            <ObjectStyler
              objects={selectedObjects}
              onStyleChange={handleStyleChange}
            >
              <div className="flex flex-col gap-3">
                <ObjectStyler.EffectList />
                <ObjectStyler.CurrentQueueEffect />
                <hr className="my-2" />
                <ObjectStyler.BackgroundColor />
                <hr className="my-2" />
                <ObjectStyler.StrokeColor />
                <ObjectStyler.StrokeWidth />
                <hr className="my-2" />
                <ObjectStyler.Opacity />
              </div>
            </ObjectStyler>
          </div>
        </div>
      )}
    </div>
  );
};
