import { ObjectStylerPanel } from 'app/object-styler-panel/ObjectStyler';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';

export const DefaultPropPanel = () => {
  return (
    <QueueScrollArea.Root className="h-full">
      <QueueScrollArea.Viewport>
        <ObjectStylerPanel />
      </QueueScrollArea.Viewport>
      <QueueScrollArea.Scrollbar orientation="vertical">
        <QueueScrollArea.Thumb />
      </QueueScrollArea.Scrollbar>
    </QueueScrollArea.Root>
  );
};
