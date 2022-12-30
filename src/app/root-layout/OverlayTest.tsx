import { FunctionComponent, useContext, useRef, useState } from 'react';
import { GlobalOverlayContext } from '../../cdk/overlay/GlobalOverlay';
import { Popover } from '../../components/popover/Popover';

export const GlobalOverlayTest: FunctionComponent<{ flag: boolean }> = () => {
  const [state, setState] = useState<number>(0);
  return (
    <button onClick={(): void => setState(state + 1)}>increase {state}</button>
  );
};

export const OverlayTest: FunctionComponent<Record<string, never>> = () => {
  const globalOverlayContext = useContext(GlobalOverlayContext);
  const ref = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<number>(0);
  const [popover, setPopover] = useState<boolean>(false);

  const openGlobalOverlay = (): void => {
    const key = globalOverlayContext.open(GlobalOverlayTest, {
      onBackdropClick: (): void => {
        globalOverlayContext.close(key);
      },
      initProps: {
        flag: true,
      },
    });
  };

  return (
    <div>
      <button ref={ref} onClick={(): void => setPopover(!popover)}>
        toggle inline overlay
      </button>

      <Popover
        visible={popover}
        target={ref.current}
        onBackdropClick={(): void => setPopover(false)}
      >
        <button onClick={(): void => setState(state + 1)}>
          increase {state}
        </button>
      </Popover>

      <button onClick={openGlobalOverlay}>open global overlay</button>
    </div>
  );
};
