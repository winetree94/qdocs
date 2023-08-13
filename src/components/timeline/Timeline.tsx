import TimeRange from '../timeline-slider/index';
import styles from './Timeline.module.scss';
import clsx from 'clsx';

export const Timeline = () => {
  return (
    <>
      <div className="tw-h-full">
        <div
          className={clsx(
            'tw-flex',
            'tw-h-[40px]',
            'tw-box-border',
            styles.header,
          )}>
          <div className="tw-text-[14px] tw-p-[12px]">
            <span className="tw-font-extrabold">Timeline</span>
          </div>
          <div className={styles.divider}></div>
          <div className="tw-text-[12px] tw-p-[12px]">
            <span>00m : 13s : 00m</span>
          </div>
        </div>
        <div className={styles.content}>
          <TimeRange />
        </div>
      </div>
    </>
  );
};
