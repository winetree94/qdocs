import { ObjectStylerPanel } from '@/legacy/app/panel-right/default-prop-panel/object-styler-panel/ObjectStyler';
import { ScrollArea } from '@radix-ui/themes';

export const DefaultPropPanel = () => {
  return (
    <ScrollArea className="tw-h-full">
      <ObjectStylerPanel />
    </ScrollArea>
  );
};
