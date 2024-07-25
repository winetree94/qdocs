import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import styles from './PresentationRemote.module.scss';
import { SettingsActions } from '@legacy/store/settings/actions';
import { QueueIconButton } from '@legacy/components/buttons/button/Button';
import { QueueToggle } from '@legacy/components/toggle/Toggle';
import { SettingSelectors } from '@legacy/store/settings';
import { QUEUE_UI_SIZE } from '@legacy/styles/ui/Size';
import { QUEUE_UI_COLOR } from '@legacy/styles/ui/Color';
import {
  RiPauseLine,
  RiPlayLine,
  RiRepeatLine,
  RiRewindLine,
  RiSpeedLine,
} from '@remixicon/react';

export const PresentationRemote = () => {
  const dispatch = useAppDispatch();
  const autoPlayRepeat = useAppSelector(SettingSelectors.autoPlayRepeat);

  return (
    <div className={styles.Container}>
      <div className={styles.ButtonGroup}>
        <QueueIconButton
          size={QUEUE_UI_SIZE.MEDIUM}
          onClick={() => dispatch(SettingsActions.rewind())}>
          <RiRewindLine size={16} />
        </QueueIconButton>
        <QueueIconButton
          size={QUEUE_UI_SIZE.MEDIUM}
          onClick={() => dispatch(SettingsActions.forward())}>
          <RiSpeedLine size={16} />
        </QueueIconButton>
        <QueueIconButton
          size={QUEUE_UI_SIZE.MEDIUM}
          color={QUEUE_UI_COLOR.DEFAULT}
          onClick={() => dispatch(SettingsActions.pause())}>
          <RiPauseLine size={16} />
        </QueueIconButton>
        <QueueIconButton
          size={QUEUE_UI_SIZE.MEDIUM}
          onClick={() => dispatch(SettingsActions.play())}>
          <RiPlayLine size={16} />
        </QueueIconButton>
        <QueueToggle.Root
          pressed={autoPlayRepeat}
          onPressedChange={(e) => dispatch(SettingsActions.setRepeat(e))}>
          <RiRepeatLine size={16} />
        </QueueToggle.Root>
      </div>
    </div>
  );
};
