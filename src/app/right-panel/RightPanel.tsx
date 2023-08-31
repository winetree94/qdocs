import QueueTab from 'components/tabs/Tab';
import { LeftPanel } from 'app/left-panel/LeftPanel';
import { useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings';
import { DefaultPropPanel } from 'app/left-panel/default-prop-panel/DefaultPropPanel';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { DocumentPanel } from 'app/document-panel/DocumentPanel';

export type RightPanelProps = React.HTMLAttributes<HTMLDivElement>;

export const RightPanel = ({ className, ...props }: RightPanelProps) => {
  const { t } = useTranslation();
  const selectedObjectIds = useAppSelector(SettingSelectors.selectedObjectIds);

  return (
    <div
      className={clsx(
        'tw-border-y',
        'tw-border-l',
        'tw-border-[var(--gray-5)]',
        'tw-rounded-l-[20px]',
        'tw-bg-[var(--gray-1)]',
        className,
      )}
      {...props}>
      <QueueTab
        className="tw-h-full"
        defaultValue={t('global.design')}
        tabs={[
          {
            name: t('global.design'),
            content: (
              <div className="tw-h-[calc(100%-46px)]">
                {selectedObjectIds.length > 0 ? (
                  <DefaultPropPanel />
                ) : (
                  <DocumentPanel />
                )}
              </div>
            ),
          },
          {
            name: 'obj 추가(임시)',
            content: <LeftPanel />,
          },
        ]}></QueueTab>
    </div>
  );
};
