import { Animator } from 'cdk/animation/Animator';
import { QueueFade, QueueRect, QueueRotate, QueueScale } from 'model/property';
import { createContext, FunctionComponent, ReactElement, useContext } from 'react';
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
});

export interface ObjectAnimatableProps {
  queueStart: number;
  queueIndex: number;
  queuePosition: 'forward' | 'backward' | 'pause';
  children: React.ReactNode;
}

export const ObjectAnimator: FunctionComponent<ObjectAnimatableProps> = ({
  children,
  queueIndex,
  queuePosition,
  queueStart,
}) => {
  const { object } = useContext(QueueObjectContainerContext);
  const effects = useAppSelector((state) => EffectSelectors.byObjectId(state, object.uuid));
  const currentFade = getCurrentFade(object, effects, queueIndex);
  const animatableFade = queueStart > 0 ? getFadeAnimation(object, effects, queueIndex, queuePosition) : undefined;
  const currentRect = getCurrentRect(object, effects, queueIndex);
  const animatableRect = queueStart > 0 ? getRectAnimation(object, effects, queueIndex, queuePosition) : undefined;
  const currentRotate = getCurrentRotate(object, effects, queueIndex);
  const animatableRotate = queueStart > 0 ? getRotateAnimation(object, effects, queueIndex, queuePosition) : undefined;
  const currentScale = getCurrentScale(object, effects, queueIndex);
  const animatableScale = queueStart > 0 ? getScaleAnimation(object, effects, queueIndex, queuePosition) : undefined;

  return (
    <Animator
      duration={animatableRect?.moveEffect.duration || 0}
      start={queueStart}
      timing={animatableRect?.moveEffect.timing}>
      {(rectProgress): ReactElement => {
        return (
          <Animator
            duration={animatableFade?.fadeEffect.duration || 0}
            start={queueStart}
            timing={animatableFade?.fadeEffect.timing}>
            {(fadeProgress): ReactElement => {
              return (
                <Animator
                  duration={animatableScale?.scaleEffect.duration || 0}
                  start={queueStart}
                  timing={animatableScale?.scaleEffect.timing}>
                  {(scaleProgress): ReactElement => {
                    return (
                      <Animator
                        duration={animatableRotate?.rotateEffect.duration || 0}
                        start={queueStart}
                        timing={animatableRotate?.rotateEffect.timing}>
                        {(rotateProgress): ReactElement => {
                          const rect = getAnimatableRect(rectProgress, currentRect, animatableRect?.fromRect);
                          const rotate = getAnimatableRotate(
                            rotateProgress,
                            currentRotate,
                            animatableRotate?.fromRotate,
                          );
                          return (
                            <QueueAnimatableContext.Provider
                              value={{
                                rect: rect,
                                fade: getAnimatableFade(fadeProgress, currentFade, animatableFade?.fromFade),
                                rotate: rotate,
                                scale: getAnimatableScale(scaleProgress, currentScale, animatableScale?.fromScale),
                              }}>
                              {children}
                            </QueueAnimatableContext.Provider>
                          );
                        }}
                      </Animator>
                    );
                  }}
                </Animator>
              );
            }}
          </Animator>
        );
      }}
    </Animator>
  );
};
