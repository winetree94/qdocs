import clsx from 'clsx';
import { ReactElement, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PlusIcon } from '@radix-ui/react-icons';
import { documentState } from '../../store/document';
import { documentSettingsState } from '../../store/settings';
import classes from './RightPanel.module.scss';
import { Dropdown } from '../../components';

export const RightPanel = (): ReactElement => {
  const queueDocument = useRecoilValue(documentState);
  const settings = useRecoilValue(documentSettingsState);
  const [radioValue, setRadioValue] = useState('radio1');
  const [checkboxCheked, setCheckboxCheked] = useState<
    boolean | 'indeterminate'
  >(true);

  const selectedObjects = queueDocument.objects.filter((object) =>
    settings.selectedObjects.includes(object.uuid)
  );
  const [firstObject] = selectedObjects;
  const objectPreview = firstObject?.type;
  const currentObjectEffectList = firstObject?.effects;
  const currentQueueEffectList = firstObject?.effects.filter(
    (effect) => effect.index === settings.queueIndex
  );

  return (
    <div className={clsx(classes['root'])}>
      {objectPreview && (
        <div>
          <p className="text-sm">Shape</p>
          <div className="flex justify-center p-4 bg-gray-200">
            <span className="text-sm">{objectPreview}(preview)</span>
          </div>
        </div>
      )}
      {currentObjectEffectList && (
        <div>
          <p className="text-sm">Effect list</p>
          <ul className={classes['effect-list']}>
            {currentObjectEffectList.map((currentObjectEffect, index) => (
              <li key={`coel-${index}`}>
                <div className="text-base">
                  <span># {currentObjectEffect.index} </span>
                  <span>{currentObjectEffect.type}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {currentQueueEffectList && (
        <div>
          <div className="flex items-center">
            <Dropdown>
              <Dropdown.Trigger className="p-1 hover:bg-slate-200">
                <PlusIcon />
              </Dropdown.Trigger>
              <Dropdown.Content side="left">
                <Dropdown.Item>Move</Dropdown.Item>
                <Dropdown.Item>Fade</Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Label>Label</Dropdown.Label>
                <Dropdown.Item>
                  <div>Item</div>
                  <div className="text-xs text-gray-400 ml-auto">K</div>
                </Dropdown.Item>
                <Dropdown.Item>Labeled item1</Dropdown.Item>
                <Dropdown.Item disabled>Disalbed item</Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.RadioGroup
                  value={radioValue}
                  onValueChange={(value): void => {
                    setRadioValue(value);
                    console.log(value);
                  }}
                >
                  <Dropdown.RadioItem value="radio1">radio1</Dropdown.RadioItem>
                  <Dropdown.RadioItem value="radio2">radio2</Dropdown.RadioItem>
                </Dropdown.RadioGroup>
                <Dropdown.Separator />
                <Dropdown.Group>
                  <Dropdown.CheckboxItem
                    checked={checkboxCheked}
                    onCheckedChange={setCheckboxCheked}
                  >
                    checkbox item
                  </Dropdown.CheckboxItem>
                  <Dropdown.CheckboxItem>checkbox item2</Dropdown.CheckboxItem>
                </Dropdown.Group>
              </Dropdown.Content>
            </Dropdown>
            <p className="text-sm">Current queue effect list</p>
          </div>
          <ul className={classes['effect-list']}>
            {currentQueueEffectList.map((currentQueueEffect, index) => (
              <li key={`cqel-${index}`}>
                <div className="text-base">
                  <span>{currentQueueEffect.type}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
