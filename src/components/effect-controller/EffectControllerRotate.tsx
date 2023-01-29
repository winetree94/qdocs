import { RotateEffect } from 'model/effect';
import { QueueRotate } from 'model/property';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';

export type EffectControllerRotateProps = {
  rotateEffect: RotateEffect;
};

export const EffectControllerRotate = ({
  rotateEffect,
}: EffectControllerRotateProps): ReactElement => {
  const [rotate, setRotate] = useState(Math.round(rotateEffect.rotate.degree));
  const [position, setPosition] = useState(rotateEffect.rotate.position);

  const handlePositionChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPosition(e.currentTarget.value as QueueRotate['position']);
  };

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
      <div>
        <p className="text-sm">direction of rotation</p>
        <div>
          <label className="flex items-center gap-1">
            <span>forward</span>
            <input
              type="radio"
              name="position"
              value="forward"
              checked={position === 'forward'}
              onChange={handlePositionChange}
            />
          </label>
          <label className="flex items-center gap-1">
            <span>reverse</span>
            <input
              type="radio"
              name="position"
              value="reverse"
              checked={position === 'reverse'}
              onChange={handlePositionChange}
            />
          </label>
        </div>
      </div>
    </>
  );
};
