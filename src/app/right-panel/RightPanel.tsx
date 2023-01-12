import clsx from 'clsx';
import { ReactElement } from 'react';
import { useRecoilValue } from 'recoil';
import { documentState, selectedObjectIdsState } from '../../store/document';
import { documentSettingsState } from '../../store/settings';
import classes from './RightPanel.module.scss';

export const RightPanel = (): ReactElement => {
  const queueDocument = useRecoilValue(documentState);
  const selectedObjectIds = useRecoilValue(selectedObjectIdsState);
  const settings = useRecoilValue(documentSettingsState);

  const selectedObjects = queueDocument.objects.filter((object) =>
    selectedObjectIds.includes(object.uuid)
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
          <p className="text-sm">Current queue effect list</p>
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
