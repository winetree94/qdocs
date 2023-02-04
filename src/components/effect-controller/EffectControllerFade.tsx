import { FadeEffect } from 'model/effect';
import { ReactElement, useEffect, useState } from 'react';

export type EffectControllerFadeProps = {
  fadeEffect: FadeEffect;
};

export const EffectControllerFade = ({
  fadeEffect,
}: EffectControllerFadeProps): ReactElement => {
  const [fadeOpacity, setFadeOpacity] = useState(fadeEffect.fade.opacity);

  useEffect(() => {
    setFadeOpacity(fadeEffect.fade.opacity);
  }, [fadeEffect.fade.opacity]);

  return (
    <>
      <div>
        <input
          type="text"
          name="type"
          value={fadeEffect.type}
          hidden
          readOnly
        />
        <p className="text-sm">fade</p>
        <div className="flex items-center gap-2">
          <input
            className="w-full"
            type="number"
            name="fadeOpacity"
            value={fadeOpacity}
            step={0.1}
            onChange={(e): void => setFadeOpacity(parseFloat(e.currentTarget.value))}
          />
        </div>
      </div>
    </>
  );
};
