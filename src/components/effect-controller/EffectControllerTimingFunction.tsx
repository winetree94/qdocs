import { QueueEffectType } from 'model/effect';
import { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { getEffectEntityKey } from 'store/effect/reducer';
import { EffectSelectors } from 'store/effect/selectors';
import { EffectActions } from '../../store/effect';
import { HistoryActions } from 'store/history';
import {
  AnimatorTimingFunctionType,
  TIMING_FUNCTION_META,
} from 'cdk/animation/timing/meta';
import { QueueSelect } from 'components/select/Select';

export type EffectControllerTimingFunctionProps = {
  effectType: QueueEffectType['type'];
};

const timingFunctions = Object.values(TIMING_FUNCTION_META);

export const EffectControllerTimingFunction = ({
  effectType,
}: EffectControllerTimingFunctionProps): ReactElement => {
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
      <p className="tw-text-sm">timing function</p>
      <QueueSelect
        defaultValue={firstObjectEffect.timing}
        onValueChange={handleTimingFunctionChange}>
        <QueueSelect.Group>
          {timingFunctions.map((timingFunction) => (
            <QueueSelect.Option value={timingFunction} key={timingFunction}>
              {timingFunction}
            </QueueSelect.Option>
          ))}
        </QueueSelect.Group>
      </QueueSelect>
    </div>
  );
};
