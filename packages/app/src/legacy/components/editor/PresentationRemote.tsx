import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import styles from './PresentationRemote.module.scss';
import { SettingsActions } from '@legacy/store/settings/actions';
import { SettingSelectors } from '@legacy/store/settings';
import {
  RiPauseLine,
  RiPlayLine,
  RiRepeatLine,
  RiRewindLine,
  RiSpeedLine,
} from '@remixicon/react';
import { Toggle } from '@radix-ui/react-toggle';
import { IconButton } from '@radix-ui/themes';

export const PresentationRemote = () => {
  const dispatch = useAppDispatch();
  const autoPlayRepeat = useAppSelector(SettingSelectors.autoPlayRepeat);

  return (
    <div className={styles.Container}>
      <div className={styles.ButtonGroup}>
        <IconButton
          onClick={() => dispatch(SettingsActions.rewind())}>
          <RiRewindLine size={16} />
        </IconButton>
        <IconButton
          onClick={() => dispatch(SettingsActions.forward())}>
          <RiSpeedLine size={16} />
        </IconButton>
        <IconButton
          onClick={() => dispatch(SettingsActions.pause())}>
          <RiPauseLine size={16} />
        </IconButton>
        <IconButton
          onClick={() => dispatch(SettingsActions.play())}>
          <RiPlayLine size={16} />
        </IconButton>
        <Toggle
          pressed={autoPlayRepeat}
          onPressedChange={(e) => dispatch(SettingsActions.setRepeat(e))}>
          <RiRepeatLine size={16} />
        </Toggle>
      </div>
    </div>
  );
};
