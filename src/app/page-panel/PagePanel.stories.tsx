import type { Meta, StoryObj } from '@storybook/react';
import { PanelResizer } from 'cdk/panel-resizer/PanelResizer';
import { PagePanel } from './PagePanel';

type Story = StoryObj<typeof PagePanel>;

const meta: Meta<typeof PagePanel> = {
  title: 'App/PagePanel',
  component: PagePanel,
  parameters: {},
};

export const Sandbox: Story = {
  render: () => (
    <div className="tw-w-full tw-h-screen tw-py-4 tw-bg-stone-200">
      <PanelResizer.Panel className="tw-h-full" width={200} minWidth={30}>
        <PanelResizer.Pane panePosition="right"></PanelResizer.Pane>
        <PagePanel />
      </PanelResizer.Panel>
    </div>
  ),
};

export default meta;
