import { QueueControlInputBoxAllProps } from '../model';
import Root from './Root';
import PrefixIcon from './PrefixIcon';
import InputBox from './InputBox';


// const setInitValue = (props: QueueControlInputBoxAllProps) => {
//   const init = {...props};
//   console.log(init);
// };


const IconInputComponent = ({valueChangeEvent, color = 'grey', variant = 'filled', ...props}: QueueControlInputBoxAllProps) => {
  return (
    <QueueControlInputBoxComponent.Root {...props} color={color} variant={variant}>
      <QueueControlInputBoxComponent.PrefixIcon {...props}></QueueControlInputBoxComponent.PrefixIcon>
      <QueueControlInputBoxComponent.InputBox valueChangeEvent={valueChangeEvent} {...props}></QueueControlInputBoxComponent.InputBox>
    </QueueControlInputBoxComponent.Root>
  );
};

const InputComponent =  ({valueChangeEvent, color = 'grey', variant = 'filled', ...props}: QueueControlInputBoxAllProps) => {
  // const { label, subDescription } = props;
  return (
    <QueueControlInputBoxComponent.Root {...props} color={color} variant={variant}>
      <QueueControlInputBoxComponent.InputBox valueChangeEvent={valueChangeEvent} {...props}></QueueControlInputBoxComponent.InputBox>
    </QueueControlInputBoxComponent.Root>
  );
};

export const QueueControlInputBoxComponent = {
  Root: Root,
  PrefixIcon: PrefixIcon,
  InputBox: InputBox,
  IconInput: IconInputComponent,
  Input: InputComponent,
};
