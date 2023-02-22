import { fitScreenSizeEvent } from 'app/events/event';
import { useEventDispatch } from 'cdk/hooks/event-dispatcher';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import clsx from 'clsx';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { QueueSeparator } from 'components/separator/Separator';
import { QueueToggle } from 'components/toggle/Toggle';
import { AppDispatch, RootState } from 'store';
import { ObjectQueueEffects, selectObjectEffectsByQueue } from 'store/legacy/selectors';
import { QueueIconButton } from '../../components/button/Button';
import styles from './Subtoolbar.module.scss';
import { connect } from 'react-redux';
import { documentSettingsSlice, QueueDocumentSettings } from 'store/settings/reducer';
import { NormalizedQueueDocument } from 'store/document/reducer';
import { DocumentSelectors } from 'store/document/selectors';
import { SettingSelectors } from 'store/settings/selectors';

export type BaseQueueSubtoolbarProps = {
  docs: NormalizedQueueDocument;
  settings: QueueDocumentSettings;
  effectsByQueues: { [key: string]: ObjectQueueEffects }[][];
  ranges: number[];
  increaseScale: () => void;
  decreaseScale: () => void;
  changeQueueIndex: (targetIndex: number, play: boolean) => void;
  changeQueuePage: (targetPage: number, targetIndex: number) => void;
  startPresentation: () => void;
};

export const BaseQueueSubtoolbar = ({
  docs,
  settings,
  effectsByQueues,
  ranges,
  increaseScale,
  decreaseScale,
  changeQueueIndex,
  changeQueuePage,
  startPresentation,
}: BaseQueueSubtoolbarProps) => {
  const currentEffectsByQueues = effectsByQueues[settings.queuePage];
  const eventDispatch = useEventDispatch();

  const onRewindQueueClick = (): void => {
    const targetPageQueueIndex = settings.queueIndex - 1;
    if (targetPageQueueIndex < 0 && settings.queuePage > 0) {
      changeQueuePage(settings.queuePage - 1, effectsByQueues[settings.queuePage - 1].length - 1);
      return;
    }
    if (targetPageQueueIndex < 0) {
      return;
    }
    changeQueueIndex(settings.queueIndex - 1, true);
  };

  const onPlayQueueClick = (): void => {
    const targetPageQueueIndex = settings.queueIndex + 1;
    if (
      targetPageQueueIndex >= effectsByQueues[settings.queuePage].length &&
      settings.queuePage < docs.pages.length - 1
    ) {
      changeQueuePage(settings.queuePage + 1, 0);
      return;
    }
    if (targetPageQueueIndex > effectsByQueues[settings.queuePage].length - 1) {
      return;
    }
    changeQueueIndex(settings.queueIndex + 1, true);
  };

  const onPresentationStartClick = (): void => {
    startPresentation();
    document.documentElement.requestFullscreen();
  };

  return (
    <QueueScrollArea.Root className={styles.Container}>
      <QueueScrollArea.Viewport>
        <div className={styles.ItemRoot}>
          <div className={styles.ItemGroup}>
            <QueueIconButton onClick={console.log}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-go-back-line'} />
            </QueueIconButton>

            <QueueIconButton onClick={console.log}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-go-forward-line'} />
            </QueueIconButton>

            <QueueIconButton>
              <SvgRemixIcon width={15} height={15} icon={'ri-file-copy-line'} />
            </QueueIconButton>

            <QueueIconButton>
              <SvgRemixIcon width={15} height={15} icon={'ri-clipboard-line'} />
            </QueueIconButton>

            <QueueIconButton onClick={onPresentationStartClick}>
              <SvgRemixIcon width={15} height={15} icon={'ri-slideshow-3-line'} />
            </QueueIconButton>

            <QueueToggle.Root size="small">
              <SvgRemixIcon width={15} height={15} icon={'ri-movie-line'} />
            </QueueToggle.Root>

            <QueueSeparator.Root orientation="vertical" decorative className={styles.Separator} />
          </div>

          <div className={styles.ItemGroup}>
            <QueueIconButton onClick={onRewindQueueClick}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-left-s-fill'} />
            </QueueIconButton>
            <QueueIconButton onClick={() => changeQueueIndex(settings.queueIndex - 1, true)}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-left-line'} />
            </QueueIconButton>
            {ranges.map((queue) => (
              <QueueIconButton
                className={clsx(
                  styles.QueueIndicator,
                  currentEffectsByQueues[queue] ? styles.HasEffect : '',
                  queue === settings.queueIndex ? styles.Current : '',
                )}
                key={queue}
                onClick={(): void => changeQueueIndex(queue, false)}>
                {queue + 1}
              </QueueIconButton>
            ))}
            <QueueIconButton onClick={() => changeQueueIndex(settings.queueIndex + 1, true)}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-right-line'} />
            </QueueIconButton>
            <QueueIconButton onClick={onPlayQueueClick}>
              <SvgRemixIcon width={15} height={15} icon={'ri-arrow-right-s-fill'} />
            </QueueIconButton>
          </div>
          <div className={styles.ItemGroup}>
            <QueueSeparator.Root orientation="vertical" decorative className={styles.Separator} />

            <QueueIconButton onClick={() => eventDispatch(fitScreenSizeEvent())}>
              <SvgRemixIcon width={15} height={15} icon={'ri-fullscreen-fill'} />
            </QueueIconButton>
            <QueueIconButton onClick={decreaseScale}>
              <SvgRemixIcon width={15} height={15} icon={'ri-subtract-line'} />
            </QueueIconButton>
            <QueueIconButton onClick={increaseScale}>
              <SvgRemixIcon width={15} height={15} icon={'ri-add-line'} />
            </QueueIconButton>
          </div>
        </div>
      </QueueScrollArea.Viewport>
      <QueueScrollArea.Scrollbar orientation="horizontal" hidden>
        <QueueScrollArea.Thumb />
      </QueueScrollArea.Scrollbar>
    </QueueScrollArea.Root>
  );
};

const mapStateToProps = (state: RootState) => ({
  docs: DocumentSelectors.selectDocs(state),
  settings: SettingSelectors.selectSettings(state),
  effectsByQueues: selectObjectEffectsByQueue(state),
  ranges: SettingSelectors.selectQueueRange(state),
});

const mapToDispatchProps = (dispatch: AppDispatch) => ({
  increaseScale: () => {
    dispatch(documentSettingsSlice.actions.increaseScale());
  },
  decreaseScale: () => {
    dispatch(documentSettingsSlice.actions.decreaseScale());
  },
  changeQueueIndex: (targetIndex: number, play?: boolean) => {
    dispatch(
      documentSettingsSlice.actions.setQueueIndex({
        queueIndex: targetIndex,
        play: play,
      }),
    );
  },
  changeQueuePage: (targetPage: number, targetIndex: number) => {
    dispatch(
      documentSettingsSlice.actions.movePage({
        pageIndex: targetPage,
        queueIndex: targetIndex,
      }),
    );
  },
  startPresentation: () => {
    dispatch(documentSettingsSlice.actions.setPresentationMode(true));
  },
});

export const QueueSubtoolbar = connect(mapStateToProps, mapToDispatchProps)(BaseQueueSubtoolbar);
