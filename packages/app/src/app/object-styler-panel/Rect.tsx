import { QueueInput } from '@legacy/components/input/Input';
import { QueueRect } from '@legacy/model/property';
import { memo } from 'react';
import { store } from 'store';
import { HistoryActions } from '@legacy/store/history';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { ObjectActions } from '@legacy/store/object';
import { SettingSelectors } from '@legacy/store/settings';

export const ObjectStyleRect = memo(() => {
  const dispatch = useAppDispatch();
  const { width, height } = useAppSelector(
    SettingSelectors.firstSelectedObjectRect,
    (prev, next) => prev.width === next.width && prev.height === next.height,
  );

  const updateRect = (rect: Partial<QueueRect>): void => {
    const selectedObjects = SettingSelectors.selectedObjects(store.getState());
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
          value={width}
          type="number"
          variant="filled"
          onChange={(e): void => updateRect({ width: Number(e.target.value) })}
        />
      </div>
      <div className="tw-flex-1">
        <QueueInput
          value={height}
          type="number"
          variant="filled"
          onChange={(e): void => updateRect({ height: Number(e.target.value) })}
        />
      </div>
    </div>
  );
});
