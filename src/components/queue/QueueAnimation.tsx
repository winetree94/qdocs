import { Animators } from 'cdk/animation/Animator';
import { getAnimatableFill, getCurrentFill, getFillAnimation } from 'components/queue/animate/fill';
import { QueueFade, QueueFill, QueueRect, QueueRotate, QueueScale } from 'model/property';
import { createContext, useContext } from 'react';
import { EffectSelectors } from 'store/effect/selectors';
import { useAppSelector } from 'store/hooks';
import { getAnimatableFade, getCurrentFade, getFadeAnimation } from './animate/fade';
import { getAnimatableRect, getCurrentRect, getRectAnimation } from './animate/rect';
import { getAnimatableRotate, getCurrentRotate, getRotateAnimation } from './animate/rotate';
import { getAnimatableScale, getCurrentScale, getScaleAnimation } from './animate/scale';
import { QueueObjectContainerContext } from './Container';

export interface QueueAnimatableContextType {
  rect: QueueRect;
  fade: QueueFade;
  rotate: QueueRotate;
  scale: QueueScale;
  fill: QueueFill;
}

export const QueueAnimatableContext = createContext<QueueAnimatableContextType>({
  rect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  fade: {
    opacity: 0,
  },
  rotate: {
    degree: 0,
  },
  scale: {
    scale: 0,
  },
  fill: {
    color: '',
    opacity: 0,
  },
});

export interface ObjectAnimatableProps {
  queueStart: number;
  queueIndex: number;
  queuePosition: 'forward' | 'backward' | 'pause';
  children: React.ReactNode;
}

export const ObjectAnimator = ({ children, queueIndex, queuePosition, queueStart }: ObjectAnimatableProps) => {
  const { object } = useContext(QueueObjectContainerContext);
  const effects = useAppSelector((state) => EffectSelectors.byObjectId(state, object.id));
  const currentFade = getCurrentFade(object, effects, queueIndex);
  const animatableFade = queueStart > 0 ? getFadeAnimation(object, effects, queueIndex, queuePosition) : undefined;
  const currentRect = getCurrentRect(object, effects, queueIndex);
  const animatableRect = queueStart > 0 ? getRectAnimation(object, effects, queueIndex, queuePosition) : undefined;
  const currentRotate = getCurrentRotate(object, effects, queueIndex);
  const animatableRotate = queueStart > 0 ? getRotateAnimation(object, effects, queueIndex, queuePosition) : undefined;
  const currentScale = getCurrentScale(object, effects, queueIndex);
  const animatableScale = queueStart > 0 ? getScaleAnimation(object, effects, queueIndex, queuePosition) : undefined;
  const currentFill = getCurrentFill(object, effects, queueIndex);
  const animatableFill = queueStart > 0 ? getFillAnimation(object, effects, queueIndex, queuePosition) : undefined;

  const animatorsProps = [
    {
      timing: animatableRect?.moveEffect.timing,
      duration: animatableRect?.moveEffect.duration || 0,
      delay: animatableRect?.moveEffect.delay || 0,
    },
    {
      timing: animatableFade?.fadeEffect.timing,
      duration: animatableFade?.fadeEffect.duration || 0,
      delay: animatableFade?.fadeEffect.delay || 0,
    },
    {
      timing: animatableScale?.scaleEffect.timing,
      duration: animatableScale?.scaleEffect.duration || 0,
      delay: animatableScale?.scaleEffect.delay || 0,
    },
    {
      timing: animatableRotate?.rotateEffect.timing,
      duration: animatableRotate?.rotateEffect.duration || 0,
      delay: animatableRotate?.rotateEffect.delay || 0,
    },
    {
      timing: animatableFill?.fillEffect.timing,
      duration: animatableFill?.fillEffect.duration || 0,
      delay: animatableFill?.fillEffect.delay || 0,
    },
  ];

  return (
    <Animators start={queueStart} animations={animatorsProps}>
      {([rectProgress, fadeProgress, scaleProgress, rotateProgress, fillProgress]) => {
        return (
          <QueueAnimatableContext.Provider
            value={{
              rect: getAnimatableRect(rectProgress, currentRect, animatableRect?.fromRect),
              fade: getAnimatableFade(fadeProgress, currentFade, animatableFade?.fromFade),
              rotate: getAnimatableRotate(rotateProgress, currentRotate, animatableRotate?.fromRotate),
              scale: getAnimatableScale(scaleProgress, currentScale, animatableScale?.fromScale),
              fill: getAnimatableFill(fillProgress, currentFill, animatableFill?.fromFill),
            }}>
            {children}
          </QueueAnimatableContext.Provider>
        );
      }}
    </Animators>
  );
};
