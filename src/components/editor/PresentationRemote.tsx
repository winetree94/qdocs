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
          <SvgRemixIcon width={30} height={30} icon={'ri-rewind-line'} className={styles.Icon} />
        </button>
        <button className={styles.ActionButton} onClick={() => dispatch(SettingsActions.forward())}>
          <SvgRemixIcon width={30} height={30} icon={'ri-play-line'} className={styles.Icon} />
        </button>
      </div>
    </div>
  );
};
