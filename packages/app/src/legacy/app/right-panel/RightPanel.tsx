import { EffectPanel } from '@legacy/app/effect-panel/EffectPanel';
import { useAppSelector } from '@legacy/store/hooks';
import { SettingSelectors } from '@legacy/store/settings';
import { DefaultPropPanel } from '@legacy/app/default-prop-panel/DefaultPropPanel';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { DocumentPanel } from '@legacy/app/document-panel/DocumentPanel';
import { useEffect, useMemo, useState } from 'react';
import { Box, Tabs, Text } from '@radix-ui/themes';

export type RightPanelProps = React.HTMLAttributes<HTMLDivElement>;

export const RightPanel = ({ className, ...props }: RightPanelProps) => {
  const { t } = useTranslation();
  const hasSelectedObject = useAppSelector(SettingSelectors.hasSelectedObject);

  const [tabValue, setTabValue] = useState<string>('design');

  useEffect(() => {
    if (tabValue === 'animation' && !hasSelectedObject) {
      setTabValue('design');
    }
  }, [hasSelectedObject, tabValue, t]);

  const tabs = useMemo(
    () => [
      {
        label: t('global.design'),
        id: 'design',
        onClick: () => setTabValue('design'),
        content: (
          <div className="tw-h-[calc(100%-46px)]">
            {hasSelectedObject ? <DefaultPropPanel /> : <DocumentPanel />}
          </div>
        ),
      },
      {
        label: t('global.animation'),
        id: 'animation',
        onClick: () => setTabValue('animation'),
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


      <Tabs.Root defaultValue={tabs[0].id}>
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Trigger value={tab.id} key={tab.id + 'list'} onClick={tab.onClick}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Box pt="3">
          {
            tabs.map((tab) => (
              <Tabs.Content value={tab.id} key={tab.id + 'content'}>
                {tab.content}
              </Tabs.Content>
            ))
          }
        </Box>
      </Tabs.Root>
    </div>
  );
};
