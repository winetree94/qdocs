import { ObjectStylerPanel } from 'app/object-styler-panel/ObjectStyler';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';

export const DefaultPropPanel: React.FC = () => {
  return (
    <QueueScrollArea.Root>
      <QueueScrollArea.Viewport>
        <ObjectStylerPanel />
      </QueueScrollArea.Viewport>
      <QueueScrollArea.Scrollbar orientation="vertical">
        <QueueScrollArea.Thumb />
      </QueueScrollArea.Scrollbar>
      <QueueScrollArea.Corner />
    </QueueScrollArea.Root>
  );
};
