import { QueueEffectType } from '@legacy/model/effect';
import { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { SettingSelectors } from '@legacy/store/settings/selectors';
import { getEffectEntityKey } from '@legacy/store/effect/reducer';
import { EffectSelectors } from '@legacy/store/effect/selectors';
import { EffectActions } from '../../../../store/effect';
import { HistoryActions } from '@legacy/store/history';
import {
  AnimatorTimingFunctionType,
  TIMING_FUNCTION_META,
  TIMING_FUNCTION_TRANSLATION_KEY,
} from '@legacy/cdk/animation/timing/meta';
import { useTranslation } from 'react-i18next';
import { Select } from '@radix-ui/themes';

export type EffectControllerTimingFunctionProps = {
  effectType: QueueEffectType['type'];
};

const timingFunctions = Object.values(TIMING_FUNCTION_META);

export const EffectControllerTimingFunction = ({
  effectType,
}: EffectControllerTimingFunctionProps): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentQueueIndex = useAppSelector(SettingSelectors.queueIndex);
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const effectsOfSelectedObjects = useAppSelector((state) =>
    EffectSelectors.byIds(
      state,
      selectedObjects.map((object) =>
        getEffectEntityKey({
          index: currentQueueIndex,
          objectId: object.id,
          type: effectType,
        }),
      ),
    ),
  );

  const [firstObjectEffect] = effectsOfSelectedObjects;

  const handleTimingFunctionChange = (timingFunction: string): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      EffectActions.upsertEffects(
        effectsOfSelectedObjects.map((effect) => ({
          ...effect,
          timing: timingFunction as AnimatorTimingFunctionType,
        })),
      ),
    );
  };

  return (
    <div>
      <p className="tw-text-sm">{t('effect.timing-function')}</p>
      <Select.Root size="1" defaultValue={firstObjectEffect.timing}
        onValueChange={handleTimingFunctionChange}>
        <Select.Trigger className='tw-w-full' />
        <Select.Content>
          {timingFunctions.map((timingFunction) => (
            <Select.Item value={timingFunction} key={timingFunction}>
              {t(TIMING_FUNCTION_TRANSLATION_KEY[timingFunction])}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
};
