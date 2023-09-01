import QueueTab from 'components/tabs/Tab';
import { EffectPanel } from 'app/effect-panel/EffectPanel';
import { useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings';
import { DefaultPropPanel } from 'app/default-prop-panel/DefaultPropPanel';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { DocumentPanel } from 'app/document-panel/DocumentPanel';
import { useEffect, useState } from 'react';

export type RightPanelProps = React.HTMLAttributes<HTMLDivElement>;

export const RightPanel = ({ className, ...props }: RightPanelProps) => {
  const { t } = useTranslation();
  const selectedObjectIds = useAppSelector(SettingSelectors.selectedObjectIds);

  const [tabValue, setTabValue] = useState<string>(t('global.design'));

  useEffect(() => {
    if (tabValue === t('global.animation') && selectedObjectIds.length <= 0) {
      setTabValue(t('global.design'));
    }
  }, [selectedObjectIds.length]);

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
        value={tabValue}
        tabs={[
          {
            name: t('global.design'),
            onClick: () => setTabValue(t('global.design')),
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
            name: t('global.animation'),
            onClick: () => setTabValue(t('global.animation')),
            disabled: selectedObjectIds.length <= 0,
            content: <EffectPanel />,
          },
        ]}></QueueTab>
    </div>
  );
};
