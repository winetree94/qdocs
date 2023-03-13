import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { useAppDispatch } from 'store/hooks';
import styles from './PresentationRemote.module.scss';
import { SettingsActions } from 'store/settings/actions';

export const PresentationRemote: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.Container}>
      <div className={styles.ButtonGroup}>
        <button className={styles.ActionButton} onClick={() => dispatch(SettingsActions.rewind())}>
          <SvgRemixIcon icon={'ri-rewind-line'} className={styles.Icon} />
        </button>
        <button className={styles.ActionButton} onClick={() => dispatch(SettingsActions.forward())}>
          <SvgRemixIcon icon={'ri-play-line'} className={styles.Icon} />
        </button>
      </div>
    </div>
  );
};
