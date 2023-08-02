import { QueueControlInputBoxComponent } from 'components/control-input-box/components';

export interface RightPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  hello?: 'world';
}

const inputValueChanges = (e: number) => {
  console.log('inputValueChanges e: ', e);
};

export const RightPanel = ({ hello, ...props }: RightPanelProps) => {
  return (
    <>
    <div {...props}>
      우측 패널임
      <div className="tw-flex">
      <QueueControlInputBoxComponent.IconInput valueChangeEvent={inputValueChanges} unit='degree'></QueueControlInputBoxComponent.IconInput>
      <QueueControlInputBoxComponent.Input valueChangeEvent={inputValueChanges} unit='percent'></QueueControlInputBoxComponent.Input>
      </div>
    </div>
    </>
  );
};
