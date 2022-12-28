import { FunctionComponent, useContext, useState } from 'react';
import { GlobalOverlayContext } from '../../cdk/overlay/GlobalOverlay';
import { Overlay } from '../../cdk/overlay/Overlay';

export const OverlayTest: FunctionComponent<Record<string, never>> = () => {
  const [flag, setFlag] = useState<boolean>(false);
  return (
    <div>
      <button onClick={(): void => setFlag(!flag)}>
        toggle overlay test component
      </button>

      {flag && <OverlayTest2></OverlayTest2>}
    </div>
  );
};

export const OverlayTest2: FunctionComponent<Record<string, never>> = () => {
  const globalOverlayContext = useContext(GlobalOverlayContext);
  const [methodFlag, setMethodFlag] = useState<boolean>(false);
  const [childrenFlag, setChildrenFlag] = useState<boolean>(false);

  const toggleMethodOverlay = (): void => {
    if (methodFlag) {
      globalOverlayContext.close('method-overlay');
    } else {
      globalOverlayContext.open(<div>hello world</div>, {
        id: 'method-overlay',
      });
    }
    setMethodFlag(!methodFlag);
  };

  return (
    <div>
      <button onClick={(): void => setChildrenFlag(!childrenFlag)}>
        toggle children overlay
      </button>
      <button onClick={(): void => toggleMethodOverlay()}>
        toggle method overlay
      </button>
      {childrenFlag && (
        <Overlay id="children-overlay">children-overlay</Overlay>
      )}
    </div>
  );
};
