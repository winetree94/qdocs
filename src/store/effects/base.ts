import { DefaultValue, selectorFamily } from 'recoil';
import { BaseQueueEffect } from 'model/effect';
import { documentPageObjects } from 'store/page';
import { cloneDeep } from 'lodash';

export const objectCurrentBasesEffect = selectorFamily<
  {
    [key: string]: BaseQueueEffect;
  },
  {
    pageIndex: number;
    queueIndex: number;
    uuid: string[];
  }
>({
  key: 'objectCurrentBasesEffect',
  get:
    (field) =>
      ({ get }): { [key: string]: BaseQueueEffect } => {
        const objects = get(documentPageObjects(field.pageIndex));

        return objects.reduce<{ [key: string]: BaseQueueEffect }>(
          (result, object) => {
            result[object.uuid] = object.effects
              .filter((effect) => effect.index <= field.queueIndex)
              .reduce<BaseQueueEffect>((_, effect) => effect, {
                index: 0,
                duration: 0,
                timing: 'linear',
              });

            return result;
          },
          {}
        );
      },
  set:
    (field) =>
      ({ get, set }, newValue): void => {
        if (newValue instanceof DefaultValue) {
          return;
        }

        const selector = documentPageObjects(field.pageIndex);
        const objects = get(selector);

        const newObjects = objects.map((object) => {
          if (!field.uuid.includes(object.uuid)) {
            return object;
          }

          const existObject = object;
          const newObject = cloneDeep(existObject);
          const currentQueueEffectIndex = newObject.effects.findIndex(
            (effect) => effect.index === field.queueIndex
          );

          newObject.effects[currentQueueEffectIndex] = {
            ...newObject.effects[currentQueueEffectIndex],
            ...newValue[object.uuid],
          };

          newObject.effects.sort((a, b) => a.index - b.index);

          return newObject;
        });

        set(selector, newObjects);
      },
});
