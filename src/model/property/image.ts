import { OBJECT_PROPERTY_META } from 'model/meta';

export interface QueueImage {
  assetId: string;
  src: string;
  alt: string;
  // TODO: Add more properties e.g. crop(width, height), filter, etc.
}

export interface WithImage {
  [OBJECT_PROPERTY_META.IMAGE]: QueueImage;
}
