/* eslint-disable no-restricted-globals */

// 상수 적절한 위치로 이동 필요
export const BLOB_URL_GENERATE_STATUS = {
  GENERATING: 'GENERATING',
  GENERATED: 'GENERATED',
  ERROR: 'ERROR',
} as const;

export type BlobURLGenerateStatusType = (typeof BLOB_URL_GENERATE_STATUS)[keyof typeof BLOB_URL_GENERATE_STATUS];

export interface BlobURLGenerateMessage {
  status: BlobURLGenerateStatusType;
  data?: {
    blobURL: string;
    fileName?: string;
  };
}

const postErrorMessage = (error?: Error) => {
  console.error(error || new Error('Unknown error'));

  self.postMessage({
    status: BLOB_URL_GENERATE_STATUS.ERROR,
  });
};

const postGeneratedMessage = (blobURL: string, fileName?: string) => {
  self.postMessage({
    status: BLOB_URL_GENERATE_STATUS.GENERATED,
    data: {
      blobURL,
      fileName,
    },
  });
};

self.onmessage = (event: MessageEvent<File>) => {
  if (!(event.data instanceof File)) {
    return;
  }

  try {
    const imageFile = event.data;
    const blob = new Blob([imageFile], { type: imageFile.type });
    const blobURL = URL.createObjectURL(blob);
    postGeneratedMessage(blobURL, imageFile.name);
  } catch (error) {
    postErrorMessage(error as Error);
  }
};
