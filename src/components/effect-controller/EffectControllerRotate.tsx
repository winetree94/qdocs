import { RotateEffect } from 'model/effect';
import { ReactElement, useEffect, useState } from 'react';

export type EffectControllerRotateProps = {
  rotateEffect: RotateEffect;
};

export const EffectControllerRotate = ({
  rotateEffect,
}: EffectControllerRotateProps): ReactElement => {
  const [rotate, setRotate] = useState(Math.round(rotateEffect.rotate.degree));

  useEffect(() => {
    setRotate(Math.round(rotateEffect.rotate.degree));
  }, [rotateEffect.rotate.degree]);

  return (
    <>
      <div>
        <input
          type="text"
          name="type"
          value={rotateEffect.type}
          hidden
          readOnly
        />
        <p className="text-sm">rotation</p>
        <div className="flex items-center gap-2">
          <input
            className="w-full"
            type="number"
            name="rotate"
            value={rotate}
            onChange={(e): void => setRotate(parseInt(e.currentTarget.value))}
          />
        </div>
      </div>
    </>
  );
};
