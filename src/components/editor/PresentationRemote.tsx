import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { selectObjectEffectsByQueue } from 'store/document/selectors';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { PageSelectors } from 'store/page/selectors';
import { documentSettingsSlice } from 'store/settings/reducer';
import { selectSettings } from 'store/settings/selectors';
import styles from './PresentationRemote.module.scss';

export const PresentationRemote: React.FC = () => {
  const dispatch = useAppDispatch();
  const effectsByQueues = useAppSelector(selectObjectEffectsByQueue);
  const pages = useAppSelector(PageSelectors.selectPages);
  const settings = useAppSelector(selectSettings);

  const setQueueIndex = (index: number, play?: boolean): void => {
    const target = Math.max(0, index);
    const sameIndex = settings.queueIndex === target;
    dispatch(
      documentSettingsSlice.actions.setSettings({
        ...settings,
        queueIndex: target,
        queuePosition: sameIndex ? 'pause' : settings.queueIndex < target ? 'forward' : 'backward',
        queueStart: play ? performance.now() : -1,
        selectedObjectUUIDs: [],
        selectionMode: 'normal',
      }),
    );
  };

  const rewind = (): void => {
    const targetPageQueueIndex = settings.queueIndex - 1;
    if (targetPageQueueIndex < 0 && settings.queuePage > 0) {
      dispatch(
        documentSettingsSlice.actions.setSettings({
          ...settings,
          queuePage: settings.queuePage - 1,
          queueIndex: effectsByQueues[settings.queuePage - 1].length - 1,
          queuePosition: 'pause',
          queueStart: -1,
          selectedObjectUUIDs: [],
          selectionMode: 'normal',
        }),
      );
      return;
    }
    if (targetPageQueueIndex < 0) {
      return;
    }
    setQueueIndex(settings.queueIndex - 1, true);
  };

  const play = (): void => {
    const targetPageQueueIndex = settings.queueIndex + 1;
    if (targetPageQueueIndex >= effectsByQueues[settings.queuePage].length && settings.queuePage < pages.length - 1) {
      dispatch(
        documentSettingsSlice.actions.setSettings({
          ...settings,
          queuePage: settings.queuePage + 1,
          queueIndex: 0,
          queuePosition: 'pause',
          queueStart: -1,
          selectedObjectUUIDs: [],
          selectionMode: 'normal',
        }),
      );
      return;
    }
    if (targetPageQueueIndex > effectsByQueues[settings.queuePage].length - 1) {
      return;
    }
    setQueueIndex(settings.queueIndex + 1, true);
  };

  return (
    <div className={styles.Container}>
      <div className={styles.ButtonGroup}>
        <button className={styles.ActionButton} onClick={rewind}>
          <SvgRemixIcon width={30} height={30} icon={'ri-rewind-line'} className={styles.Icon} />
        </button>
        <button className={styles.ActionButton} onClick={play}>
          <SvgRemixIcon width={30} height={30} icon={'ri-play-line'} className={styles.Icon} />
        </button>
      </div>
    </div>
  );
};
