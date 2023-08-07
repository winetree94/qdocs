import { QueueControlInputBoxComponent } from 'components/control-input-box/components';
import QueueButtonGroup from 'components/buttons/button-group/ButtonGroup';
import { QueueButton } from 'components/buttons/button/Button';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';

export interface RightPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  hello?: 'world';
}

const inputValueChanges = (e: number) => {
  // console.log('inputValueChanges e: ', e);
};

export const RightPanel = ({ hello, ...props }: RightPanelProps) => {
  return (
    <>
      <div {...props}>
        우측 패널임
        <div className="tw-flex">
          <QueueControlInputBoxComponent.Wrapper color="grey" variant="filled">
            <QueueControlInputBoxComponent.InputBox
              unit="percent"
              valueChangeEvent={inputValueChanges}
              {...props}></QueueControlInputBoxComponent.InputBox>
          </QueueControlInputBoxComponent.Wrapper>

          <QueueControlInputBoxComponent.Wrapper color="grey" variant="filled">
            <QueueControlInputBoxComponent.PrefixIcon
              prefixType="img"
              prefixValue="type"></QueueControlInputBoxComponent.PrefixIcon>
            <QueueControlInputBoxComponent.InputBox
              unit="percent"
              valueChangeEvent={inputValueChanges}
              {...props}></QueueControlInputBoxComponent.InputBox>
          </QueueControlInputBoxComponent.Wrapper>
        </div>
        <QueueButtonGroup>
          <QueueButton
            type="button"
            size={QUEUE_UI_SIZE.MEDIUM}
            color={QUEUE_UI_COLOR.RED}
            onClick={() => console.log(1)}>
            btn1
          </QueueButton>
          <QueueButton
            type="button"
            size={QUEUE_UI_SIZE.MEDIUM}
            color={QUEUE_UI_COLOR.BLUE}
            onClick={() => console.log(2)}>
            btn2
          </QueueButton>
          <QueueButton
            type="button"
            size={QUEUE_UI_SIZE.MEDIUM}
            color={QUEUE_UI_COLOR.DEFAULT}
            onClick={() => console.log(3)}>
            btn3
          </QueueButton>
          <QueueButton
            type="button"
            size={QUEUE_UI_SIZE.MEDIUM}
            color={QUEUE_UI_COLOR.RED}
            onClick={() => console.log(4)}>
            btn4
          </QueueButton>
        </QueueButtonGroup>
      </div>
    </>
  );
};
