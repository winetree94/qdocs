import clsx from 'clsx';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { BaseHTMLAttributes } from 'react';

const PagePanelRoot = ({ className, ...props }: BaseHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx(
        'tw-flex',
        'tw-flex-col',
        'tw-gap-1',
        'tw-w-full',
        'tw-h-full',
        'tw-p-3',
        'tw-border-y',
        'tw-border-r',
        'tw-rounded-r-lg',
        'tw-border-stone-300',
        'tw-bg-white',
        className,
      )}
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

export const PagePanel = () => {
  return (
    <QueueScrollArea.Root className="tw-h-full">
      <QueueScrollArea.Viewport>
        <PagePanelRoot>
          {new Array(100).fill(0).map((_, index) => (
            <PageBox>
              <div className="tw-shrink-0 tw-flex tw-flex-col tw-justify-between tw-items-end">
                {/* 실제 문서의 페이지 인덱스를 사용해야함 */}
                <div className="tw-text-xs tw-cursor-default">{index + 1}</div>
                <div className="tw-text-[var(--gray-10)]">
                  <button className='tw-cursor-pointer'>
                    <SvgRemixIcon icon="ri-file-copy-line" size={QUEUE_UI_SIZE.MEDIUM} />
                  </button>
                </div>
              </div>

              <div className="tw-flex-1 tw-max-w-[80%]">
                <PagePreview />
              </div>
            </PageBox>
          ))}
        </PagePanelRoot>
      </QueueScrollArea.Viewport>
      <QueueScrollArea.Scrollbar>
        <QueueScrollArea.Thumb />
      </QueueScrollArea.Scrollbar>
    </QueueScrollArea.Root>
  );
};
