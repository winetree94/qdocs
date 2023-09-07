import QueueTab from 'components/tabs/Tab';
import { EffectPanel } from 'app/effect-panel/EffectPanel';
import { useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings';
import { DefaultPropPanel } from 'app/default-prop-panel/DefaultPropPanel';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { DocumentPanel } from 'app/document-panel/DocumentPanel';
import { useEffect, useMemo, useState } from 'react';

export type RightPanelProps = React.HTMLAttributes<HTMLDivElement>;

export const RightPanel = ({ className, ...props }: RightPanelProps) => {
  const { t } = useTranslation();
  const hasSelectedObject = useAppSelector(SettingSelectors.hasSelectedObject);

  const [tabValue, setTabValue] = useState<string>(t('global.design'));

  useEffect(() => {
    if (tabValue === t('global.animation') && !hasSelectedObject) {
      setTabValue(t('global.design'));
    }
  }, [hasSelectedObject, tabValue, t]);

  const tabs = useMemo(
    () => [
      {
        name: t('global.design'),
        onClick: () => setTabValue(t('global.design')),
        content: (
          <div className="tw-h-[calc(100%-46px)]">
            {hasSelectedObject ? <DefaultPropPanel /> : <DocumentPanel />}
          </div>
        ),
      },
      {
        name: t('global.animation'),
        onClick: () => setTabValue(t('global.animation')),
        disabled: !hasSelectedObject,
        content: <EffectPanel />,
      },
    ],
    [hasSelectedObject, t],
  );

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
      <QueueTab className="tw-h-full" value={tabValue} tabs={tabs}></QueueTab>
    </div>
  );
};
