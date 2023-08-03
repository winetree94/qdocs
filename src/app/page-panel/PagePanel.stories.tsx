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
    <PanelResizer.Panel>
      <PanelResizer.Pane panePosition="left"></PanelResizer.Pane>
      <PagePanel />
    </PanelResizer.Panel>
  ),
};

export default meta;
