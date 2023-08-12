export const SUPPORTED_LANGUAGE = {
  KO: 'ko',
  EN: 'en',
  AUTO: 'auto',
} as const;

export type SUPPORTED_LANGUAGES =
  (typeof SUPPORTED_LANGUAGE)[keyof typeof SUPPORTED_LANGUAGE];
