/* eslint-disable no-restricted-globals */

// 상수 적절한 위치로 이동 필요
export const IMAGE_ENCODING_STATUS = {
  ENCODING: 'ENCODING',
  ENCODED: 'ENCODED',
  ERROR: 'ERROR',
} as const;

export type ImageEncodingStatusType = (typeof IMAGE_ENCODING_STATUS)[keyof typeof IMAGE_ENCODING_STATUS];

export interface ImageEncodingMessage {
  status: ImageEncodingStatusType;
  imageData?: {
    src?: string;
    fileName?: string;
  };
}

self.onmessage = (event: MessageEvent<File>) => {
  if (!(event.data instanceof File)) {
    return;
  }

  const imageFile = event.data;
  const fileReader = new FileReader();

  fileReader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
    const base64Data = event.target.result?.toString().split(',')[1] ?? '';
    const imageType = imageFile.type;
    const fileName = imageFile.name;

    if (base64Data === '') {
      self.postMessage({
        status: IMAGE_ENCODING_STATUS.ERROR,
      });

      return;
    }

    self.postMessage({
      status: IMAGE_ENCODING_STATUS.ENCODED,
      imageData: {
        src: `data:${imageType};base64,${base64Data}`,
        fileName,
      },
    });
  });

  try {
    self.postMessage({
      status: IMAGE_ENCODING_STATUS.ENCODING,
    });
    fileReader.readAsDataURL(imageFile);
  } catch (error) {
    console.error(error);

    self.postMessage({
      status: IMAGE_ENCODING_STATUS.ERROR,
    });
  }
};
