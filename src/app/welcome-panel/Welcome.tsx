import { NewDocumentDialog } from 'app/new-document-dialog/NewDocumentDialog';
import clsx from 'clsx';
import { useAppDispatch } from 'store/hooks';
import { DocumentActions } from '../../store/document';
import { useTranslation } from 'react-i18next';
import { useRootRenderer } from 'cdk/root-renderer/root-renderer';
import { RootState } from 'store';
import welcomeImage from './welcome.svg';

export const Welcome = () => {
  const dispatch = useAppDispatch();
  const rootRenderer = useRootRenderer();
  const { t } = useTranslation();

  const onNewDocumentClick = (): void => {
    rootRenderer.render(
      <NewDocumentDialog
        onSubmit={(document) => {
          dispatch(DocumentActions.loadDocument(document));
        }}
      />,
    );
  };

  const startFileChooser = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    const onFileSelected = (): void => {
      try {
        if (!input.files) {
          return;
        }
        const file = input.files[0];
        if (!file) {
          return;
        }
        const fileReader = new FileReader();
        fileReader.onload = (e): void => {
          const result = e.target?.result as string;
          const document = JSON.parse(result) as RootState;
          dispatch(DocumentActions.loadDocument(document));
        };
        fileReader.readAsText(file);
      } catch (e) {
        console.warn(e);
      }
    };
    input.addEventListener('change', onFileSelected, { once: true });
  };

  return (
    <div
      className={clsx(
        'tw-flex-auto',
        'tw-flex',
        'tw-flex-col',
        'tw-justify-center',
        'tw-items-center',
      )}>
      <div className="tw-relative tw-overflow-hidden tw-flex tw-flex-col tw-justify-between tw-w-[350px] tw-h-[500px] tw-px-9 tw-pt-[64px] tw-pb-4 tw-border tw-border-queue-500 tw-rounded-[36px]">
        <div>
          <h1 className="tw-font-ibm tw-text-[36px] tw-leading-none tw-text-queue-500 tw-text-center">
            .Qdocs
          </h1>
          <p className="tw-mt-2 tw-font-ibm tw-font-normal tw-leading-none tw-text-queue-500 tw-text-center">
            Play documents
          </p>
        </div>
        <div className="tw-flex tw-flex-col tw-gap-2">
          {/* TODO button component 사용할 지 살펴보기 */}
          <button
            className="tw-flex tw-justify-center tw-items-center tw-p-4 tw-rounded-full tw-bg-queue-500 tw-text-white-100 tw-leading-none tw-text-sm tw-font-medium"
            onClick={onNewDocumentClick}>
            {t('welcome.new-document')}
          </button>
          <button
            className="tw-flex tw-justify-center tw-items-center tw-p-4 tw-text-queue-500 tw-text-sm tw-font-medium"
            onClick={startFileChooser}>
            {t('welcome.open-document')}
          </button>
        </div>

        <img
          className="tw-absolute tw-top-[76px] tw-left-0 tw-select-none tw-pointer-events-none"
          src={welcomeImage}
          alt={t('welcome.image-alt')}
        />
      </div>
    </div>
  );
};
