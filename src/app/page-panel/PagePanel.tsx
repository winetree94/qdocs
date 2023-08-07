import { BaseHTMLAttributes } from 'react';
import clsx from 'clsx';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { QueueButton } from 'components/button/Button';
import { QueueSeparator } from 'components/separator/Separator';

const PagePanelRoot = ({ className, ...props }: BaseHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx(
        'tw-relative',
        'tw-w-full',
        'tw-h-full',
        'tw-pb-[69px]',
        'tw-border-y',
        'tw-border-r',
        'tw-rounded-r-lg',
        'tw-border-[var(--gray-5)]',
        'tw-bg-[var(--gray-1)]',
        className,
      )}
      {...props}
    />
  );
};

const PagesBox = ({ className, ...props }: BaseHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx('tw-p-3', 'tw-flex', 'tw-flex-col', 'tw-gap-1', 'tw-w-full', 'tw-h-full', className)}
      {...props}
    />
  );
};

const PageBox = ({ className, ...props }: BaseHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx(
        'tw-flex',
        'tw-justify-end',
        'tw-gap-1',
        'tw-h-[90px]',
        'tw-p-2',
        'tw-rounded-lg',
        'hover:tw-bg-[var(--gray-4)]',
        className,
      )}
      {...props}
    />
  );
};

const PagePreview = () => {
  return (
    <div
      className={clsx(
        'tw-w-full',
        'tw-h-full',
        'tw-border',
        'tw-border-[var(--blue-10)]',
        'tw-rounded-lg',
        'tw-bg-[var(--gray-1)]',
      )}></div>
  );
};

const PageAddBox = ({ className, ...props }: BaseHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx(
        'tw-absolute',
        'tw-bottom-0',
        'tw-left-0',
        'tw-w-full',
        'tw-p-3',
        'tw-bg-[var(--gray-1)]',
        className,
      )}
      {...props}
    />
  );
};

export const PagePanel = () => {
  return (
    <PagePanelRoot>
      <QueueScrollArea.Root className="tw-h-full">
        <QueueScrollArea.Viewport>
          <PagesBox>
            {new Array(100).fill(0).map((_, index) => (
              <PageBox>
                <div className="tw-shrink-0 tw-flex tw-flex-col tw-justify-between tw-items-end">
                  {/* 실제 문서의 페이지 인덱스를 사용해야함 */}
                  <div className="tw-text-xs tw-cursor-default">{index + 1}</div>
                  <div className="tw-text-[var(--gray-10)]">
                    <button className="tw-cursor-pointer">
                      <SvgRemixIcon icon="ri-file-copy-line" size={QUEUE_UI_SIZE.MEDIUM} />
                    </button>
                  </div>
                </div>

                <div className="tw-flex-1 tw-max-w-[80%]">
                  <PagePreview />
                </div>
              </PageBox>
            ))}
          </PagesBox>
        </QueueScrollArea.Viewport>
        <QueueScrollArea.Scrollbar>
          <QueueScrollArea.Thumb />
        </QueueScrollArea.Scrollbar>
      </QueueScrollArea.Root>
      <PageAddBox>
        <QueueSeparator.Root className='tw-mb-3'/>
        <QueueButton
          className="tw-w-full tw-box-border tw-text-sm"
          size={QUEUE_UI_SIZE.MEDIUM}
          color={QUEUE_UI_COLOR.DEFAULT}>
          <SvgRemixIcon icon="ri-add-box-line" size={QUEUE_UI_SIZE.MEDIUM} />
          <span className='tw-ml-1'>Add slide</span>
        </QueueButton>
      </PageAddBox>
    </PagePanelRoot>
  );
};
