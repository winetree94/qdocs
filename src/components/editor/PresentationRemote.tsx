import styles from './PresentationRemote.module.scss';

export const PresentationRemote: React.FC = () => {
  const preventDefault = (event: React.MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className={styles.Container}
      onMouseDown={preventDefault}
    >
    </div>
  );
};