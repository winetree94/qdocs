/* eslint-disable no-restricted-globals */

/**
 * Blob URL 몇가지 문제가 있어서 사용하지 않음
 * 1. 메모리 누수 방지를 위해 revoke 하는데 페이지 이동 시 image 로드할 수 없음
 * 2. 파일 export할 때도 마찬가지로 URL을 읽을 수 없음(revoke 되었기 때문)
 */

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
    url: string;
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
      url: blobURL,
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
