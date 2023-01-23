import { Animator } from 'cdk/animation/Animator';
import { QueueFade, QueueRect, QueueRotate, QueueScale } from 'model/object/rect';
import { createContext, FunctionComponent, ReactElement, useContext } from 'react';
import { getAnimatableFade, getCurrentFade, getFadeAnimation } from './animate/fade';
import { getAnimatableRect, getCurrentRect, getRectAnimation } from './animate/rect';
import { getAnimatableRotate, getCurrentRotate, getRotateAnimation } from './animate/rotate';
import { getAnimatableScale, getCurrentScale, getScaleAnimation } from './animate/scale';
import { QueueObjectContainerContext } from './Container';

export interface QueueAnimatableContextType {
  rect: QueueRect;
  fade: QueueFade;
  scale: QueueScale;
  rotate: QueueRotate;
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
  scale: {
    scale: 1,
  },
  rotate: {
    x: 0,
    y: 0,
    position: 'forward',
    degree: 0,
  }
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
  const currentFade = getCurrentFade(object, queueIndex);
  const animatableFade = queueStart > 0 ? getFadeAnimation(object, queueIndex, queuePosition) : undefined;
  const currentRect = getCurrentRect(object, queueIndex);
  const animatableRect = queueStart > 0 ? getRectAnimation(object, queueIndex, queuePosition) : undefined;
  const currentScale = getCurrentScale(object, queueIndex);
  const animatableScale = queueStart > 0 ? getScaleAnimation(object, queueIndex, queuePosition) : undefined;
  const currentRotate = getCurrentRotate(object, queueIndex);
  const animatableRotate = queueStart > 0 ? getRotateAnimation(object, queueIndex, queuePosition) : undefined;

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
                          return (
                            <QueueAnimatableContext.Provider value={{
                              rect: getAnimatableRect(rectProgress, currentRect, animatableRect?.fromRect),
                              fade: getAnimatableFade(fadeProgress, currentFade, animatableFade?.fromFade),
                              scale: getAnimatableScale(scaleProgress, currentScale, animatableScale?.fromScale),
                              rotate: getAnimatableRotate(rotateProgress, currentRotate, animatableRotate?.fromRotate),
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