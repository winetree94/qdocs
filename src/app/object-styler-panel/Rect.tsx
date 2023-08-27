import { QueueInput } from 'components/input/Input';
import { QueueRect } from 'model/property';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';

export const ObjectStyleRect = () => {
  const dispatch = useAppDispatch();
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const [firstObject] = selectedObjects;

  const rect = firstObject.rect;

  const updateRect = (rect: Partial<QueueRect>): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.map((object) => ({
          id: object.id,
          changes: {
            rect: {
              ...object.rect,
              ...rect,
            },
          },
        })),
      ),
    );
  };

  return (
    <div className="tw-flex tw-gap-2">
      <div className="tw-flex-1">
        <QueueInput
          value={rect.width}
          type="number"
          variant="filled"
          onChange={(e): void => updateRect({ width: Number(e.target.value) })}
        />
      </div>
      <div className="tw-flex-1">
        <QueueInput
          value={rect.height}
          type="number"
          variant="filled"
          onChange={(e): void => updateRect({ height: Number(e.target.value) })}
        />
      </div>
    </div>
  );
};
