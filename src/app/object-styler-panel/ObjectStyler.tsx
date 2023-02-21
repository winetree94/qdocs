import { ChevronDownIcon } from '@radix-ui/react-icons';
import { debounce } from 'cdk/functions/debounce';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { Slider } from 'components';
import { QueueInput } from 'components/input/Input';
import { QueueSelect } from 'components/select/Select';
import { QueueToggleGroup } from 'components/toggle-group/ToggleGroup';
import { QueueObjectType, QueueSquare } from 'model/object';
import { QueueText } from 'model/property';
import {
  ChangeEvent,
  createContext,
  FormEvent,
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { setDocument, setObjectDefaultProps } from 'store/document/actions';
import { selectDocument, selectObjectDefaultProps, selectPageObjectByUUID } from 'store/document/selectors';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectSettings } from 'store/settings/selectors';
import classes from './ObjectStyler.module.scss';

// context start
interface ObjectStylerContextValue {
  objects: QueueObjectType[];
}

const ObjectStylerContext = createContext<ObjectStylerContextValue | null>(null);

const useObjectStylerContext = (): ObjectStylerContextValue => {
  const context = useContext(ObjectStylerContext);

  if (!context) {
    throw new Error('useObjectStylerContext Provider not found!');
  }

  return context;
};
// context end

// ------------- styler start -------------
type StyleChangeValue = { [k: string]: FormDataEntryValue };
interface ObjectStylerProps extends PropsWithChildren {
  objects: QueueObjectType[];
  onStyleChange?: (value: StyleChangeValue) => void;
}

const ObjectStyler = ({ children, objects, onStyleChange }: ObjectStylerProps): ReactElement => {
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

const ObjectStylerBackground = (): ReactElement => {
  const { objects } = useObjectStylerContext();
  const [firstObject] = objects;
  const [opacity, setOpacity] = useState([firstObject.fill.opacity]);

  const handleOpacityChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setOpacity([parseInt(e.currentTarget.value, 10)]);
  };

  useEffect(() => {
    setOpacity([firstObject.fill.opacity]);
  }, [firstObject]);

  return (
    <div>
      <div className="mb-1">
        <p className="font-medium">Background</p>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm">color</p>
          <div className="w-6 h-6">
            <label className={classes['input-color']} style={{ backgroundColor: firstObject.fill.color }}>
              <input
                type="color"
                name="backgroundColor"
                id="backgroundColor"
                className={classes['input-color']}
                defaultValue={firstObject.fill.color}
              />
            </label>
          </div>
        </div>
        <div>
          <input type="text" name="backgroundOpacity" value={opacity[0]} readOnly hidden />
          <p className="text-sm">opacity</p>
          <div className="flex items-center gap-2">
            <div className="w-1/3">
              <input className="w-full" type="number" step={0.1} value={opacity[0]} onChange={handleOpacityChange} />
            </div>
            <div className="flex items-center w-full">
              <Slider min={0} max={1} step={0.1} value={opacity} onValueChange={setOpacity} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ObjectStylerStroke = (): ReactElement | null => {
  const { objects } = useObjectStylerContext();
  const [firstObject] = objects;

  const tempType = firstObject as QueueSquare;
  const [width, setWidth] = useState([tempType.stroke.width]);

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setWidth([parseInt(e.currentTarget.value, 10)]);
  };

  useEffect(() => {
    setWidth([tempType.stroke.width]);
  }, [tempType]);

  if (firstObject.type === 'icon') {
    return null;
  }

  return (
    <div>
      <div className="mb-1">
        <p className="font-medium">Border</p>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <input type="text" name="strokeWidth" value={width[0]} readOnly hidden />
          <p className="text-sm">width</p>
          <div className="flex items-center gap-2">
            <div className="w-1/3">
              <input className="w-full" type="number" value={width[0]} onChange={handleWidthChange} />
            </div>
            <div className="flex items-center w-full">
              <Slider min={0} max={100} value={width} onValueChange={setWidth} />
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm">color</p>
          <div className="w-6 h-6">
            <label className={classes['input-color']} style={{ backgroundColor: firstObject.stroke.color }}>
              <input
                type="color"
                name="strokeColor"
                id="strokeColor"
                className={classes['input-color']}
                defaultValue={firstObject.stroke.color}
              />
            </label>
          </div>
        </div>
        <div>
          <p className="text-sm">style</p>
          <div>
            <select defaultValue={firstObject.stroke.dasharray}>
              <option value="solid">--------</option>
              <option value="">- - - - -</option>
              <option value="">-- -- --</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const ObjectStylerOpacity = (): ReactElement => {
  const { objects } = useObjectStylerContext();
  const [firstObject] = objects;
  const [opacity, setOpacity] = useState([firstObject.fade.opacity]);

  const handleOpacityChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setOpacity([parseInt(e.currentTarget.value, 10)]);
  };

  useEffect(() => {
    setOpacity([firstObject.fade.opacity]);
  }, [firstObject]);

  return (
    <div>
      <div>
        <input type="text" name="opacity" value={opacity[0]} readOnly hidden />
        <p className="text-sm">opacity</p>
        <div className="flex items-center gap-2">
          <div className="w-1/3">
            <input className="w-full" type="number" step={0.1} value={opacity[0]} onChange={handleOpacityChange} />
          </div>
          <div className="flex items-center w-full">
            <Slider min={0} max={1} step={0.1} value={opacity} onValueChange={setOpacity} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ObjectStyleText = (): ReactElement => {
  const settings = useAppSelector(selectSettings);
  const { objects } = useObjectStylerContext();
  const [firstObject] = objects;

  const props = useAppSelector(selectObjectDefaultProps(settings.queuePage));
  const object = useAppSelector(selectPageObjectByUUID(settings.queuePage, firstObject.uuid));
  const dispatch = useAppDispatch();

  // const [props, setProps] = useRecoilState(
  //   objectDefaultProps({
  //     pageIndex: settings.queuePage,
  //   })
  // );

  const text = props[firstObject.uuid].text;

  const [currentText, setCurrentText] = useState(object.text);

  const updateCurrentText = (text: Partial<QueueText>): void => {
    setCurrentText({
      ...currentText,
      ...text,
    });
  };

  const updateText = useCallback(
    (text: Partial<QueueText>): void => {
      dispatch(
        setObjectDefaultProps({
          page: settings.queuePage,
          queueIndex: settings.queueIndex,
          props: {
            ...props,
            [firstObject.uuid]: {
              ...props[firstObject.uuid],
              text: {
                ...props[firstObject.uuid].text,
                ...text,
              },
            },
          },
        }),
      );
    },
    [dispatch, firstObject.uuid, props, settings.queueIndex, settings.queuePage],
  );

  useEffect(() => {
    if (
      currentText.fontColor !== object.text.fontColor ||
      currentText.fontFamily !== object.text.fontFamily ||
      currentText.fontSize !== object.text.fontSize ||
      currentText.horizontalAlign !== object.text.horizontalAlign ||
      currentText.verticalAlign !== object.text.verticalAlign
    ) {
      updateText(currentText);
    }
  }, [currentText, object.text, updateText]);

  return (
    <div>
      <div>
        <h3>Text Settings</h3>
      </div>
      <div>
        <QueueSelect.Root
          value={currentText.fontFamily}
          onValueChange={(value): void => updateCurrentText({ fontFamily: value })}>
          <QueueSelect.Trigger className="SelectTrigger" aria-label="Food">
            <QueueSelect.Value placeholder="Select a fruit…" />
            <QueueSelect.Icon className="SelectIcon">
              <ChevronDownIcon />
            </QueueSelect.Icon>
          </QueueSelect.Trigger>
          <QueueSelect.Portal>
            <QueueSelect.Content className="SelectContent">
              <QueueSelect.Viewport className="SelectViewport">
                <QueueSelect.Group>
                  <QueueSelect.Item value="Arial">Arial</QueueSelect.Item>
                  <QueueSelect.Item value="Inter">Inter</QueueSelect.Item>
                  <QueueSelect.Item value="Roboto">Roboto</QueueSelect.Item>
                </QueueSelect.Group>
              </QueueSelect.Viewport>
            </QueueSelect.Content>
          </QueueSelect.Portal>
        </QueueSelect.Root>
      </div>
      <div>
        <div>가로 정렬</div>
        <QueueToggleGroup.Root
          type="single"
          value={currentText.horizontalAlign}
          onValueChange={(value: 'left' | 'center' | 'right'): void =>
            updateCurrentText({
              horizontalAlign: value || currentText.horizontalAlign,
            })
          }>
          <QueueToggleGroup.Item value="left" size="small">
            <SvgRemixIcon width={15} height={15} icon={'ri-align-left'} />
          </QueueToggleGroup.Item>
          <QueueToggleGroup.Item value="center" size="small">
            <SvgRemixIcon width={15} height={15} icon={'ri-align-center'} />
          </QueueToggleGroup.Item>
          <QueueToggleGroup.Item value="right" size="small">
            <SvgRemixIcon width={15} height={15} icon={'ri-align-right'} />
          </QueueToggleGroup.Item>
        </QueueToggleGroup.Root>
      </div>
      <div>
        <div>세로 정렬</div>
        <QueueToggleGroup.Root
          type="single"
          value={currentText.verticalAlign}
          onValueChange={(value: 'top' | 'middle' | 'bottom'): void =>
            updateCurrentText({
              verticalAlign: value || currentText.verticalAlign,
            })
          }>
          <QueueToggleGroup.Item value="top" size="small">
            <SvgRemixIcon width={15} height={15} icon={'ri-align-top'} />
          </QueueToggleGroup.Item>
          <QueueToggleGroup.Item value="middle" size="small">
            <SvgRemixIcon width={15} height={15} icon={'ri-align-vertically'} />
          </QueueToggleGroup.Item>
          <QueueToggleGroup.Item value="bottom" size="small">
            <SvgRemixIcon width={15} height={15} icon={'ri-align-bottom'} />
          </QueueToggleGroup.Item>
        </QueueToggleGroup.Root>
      </div>
      <div>
        <div>색상</div>
        <input
          type="color"
          value={currentText.fontColor}
          onChange={(e): void => updateCurrentText({ fontColor: e.target.value })}
        />
      </div>
      <div>
        <QueueInput
          value={text.fontSize}
          type="number"
          onChange={(e): void => updateCurrentText({ fontSize: Number(e.target.value) })}
        />
      </div>
    </div>
  );
};

ObjectStyler.Background = ObjectStylerBackground;
ObjectStyler.Stroke = ObjectStylerStroke;
ObjectStyler.Opacity = ObjectStylerOpacity;
ObjectStyler.Text = ObjectStyleText;
// ------------- styler end -------------

export const ObjectStylerPanel = ({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>): ReactElement | null => {
  const settings = useAppSelector(selectSettings);
  const queueDocument = useAppSelector(selectDocument);
  const dispatch = useAppDispatch();
  const selectedObjects = queueDocument!.pages[settings.queuePage].objects.filter((object) =>
    settings.selectedObjectUUIDs.includes(object.uuid),
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setDocumentHistory = useCallback(
    debounce(() => {
      console.log('history save');
    }, 500),
    [],
  );

  const handleStyleChange = (value: StyleChangeValue): void => {
    const newObjects = queueDocument!.pages[settings.queuePage].objects.map((object) => {
      if (!settings.selectedObjectUUIDs.includes(object.uuid)) {
        return object;
      }

      // 선택된 오브젝트 -> 변경되는 스타일 적용해야함
      const updatedModel = ((): QueueObjectType => {
        switch (object.type) {
          case 'rect':
          case 'circle':
          case 'line':
            return {
              ...object,
              fill: {
                ...object.fill,
                color: value.backgroundColor as string,
                opacity: parseFloat(value.backgroundOpacity as string),
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
          case 'icon':
            return {
              ...object,
              fill: {
                ...object.fill,
                color: value.backgroundColor as string,
              },
              fade: {
                ...object.fade,
                opacity: parseFloat(value.opacity as string),
              },
            };
        }
      })();

      return updatedModel;
    });

    const newPages = queueDocument!.pages.slice(0);
    newPages[settings.queuePage] = {
      ...queueDocument!.pages[settings.queuePage],
      objects: newObjects,
    };

    dispatch(
      setDocument({
        ...queueDocument!,
        pages: newPages,
      }),
    );
    setDocumentHistory();
  };

  return (
    <div className="p-2">
      <ObjectStyler objects={selectedObjects} onStyleChange={handleStyleChange}>
        <div className="flex flex-col gap-3">
          <ObjectStyler.Background />
          <hr className="my-2" />
          {selectedObjects[0].type !== 'icon' && (
            <>
              <ObjectStyler.Stroke />
              <hr className="my-2" />
            </>
          )}
          <ObjectStyler.Opacity />
          <ObjectStyler.Text />
        </div>
      </ObjectStyler>
    </div>
  );
};
