import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import styles from './PresentationRemote.module.scss';
import { SettingsActions } from 'store/settings/actions';
import { QueueIconButton } from 'components/buttons/button/Button';
import { QueueToggle } from 'components/toggle/Toggle';
import { SettingSelectors } from 'store/settings';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';

export const PresentationRemote = () => {
  const dispatch = useAppDispatch();
  const autoPlayRepeat = useAppSelector(SettingSelectors.autoPlayRepeat);

  return (
    <div className={styles.Container}>
      <div className={styles.ButtonGroup}>
        <QueueIconButton
          size={QUEUE_UI_SIZE.MEDIUM}
          onClick={() => dispatch(SettingsActions.rewind())}>
          <SvgRemixIcon icon={'ri-rewind-line'} />
        </QueueIconButton>
        <QueueIconButton
          size={QUEUE_UI_SIZE.MEDIUM}
          onClick={() => dispatch(SettingsActions.forward())}>
          <SvgRemixIcon icon={'ri-speed-line'} />
        </QueueIconButton>
        <QueueIconButton
          size={QUEUE_UI_SIZE.MEDIUM}
          color={QUEUE_UI_COLOR.DEFAULT}
          onClick={() => dispatch(SettingsActions.pause())}>
          <SvgRemixIcon icon={'ri-pause-line'} />
        </QueueIconButton>
        <QueueIconButton
          size={QUEUE_UI_SIZE.MEDIUM}
          onClick={() => dispatch(SettingsActions.play())}>
          <SvgRemixIcon icon={'ri-play-line'} />
        </QueueIconButton>
        <QueueToggle.Root
          pressed={autoPlayRepeat}
          onPressedChange={(e) => dispatch(SettingsActions.setRepeat(e))}>
          <SvgRemixIcon icon={'ri-repeat-line'} />
        </QueueToggle.Root>
      </div>
    </div>
  );
};
