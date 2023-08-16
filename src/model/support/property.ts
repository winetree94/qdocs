import { OBJECT_TYPE, QueueObjectType } from 'model/object';
import {
  OBJECT_PROPERTY_META,
  WithFade,
  WithFill,
  WithImage,
  WithRect,
  WithRotation,
  WithScale,
  WithStroke,
  WithText,
} from 'model/property';

const SUPPPORTED_PROPERTY_MAP = {
  [OBJECT_PROPERTY_META.RECT]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
  },
  [OBJECT_PROPERTY_META.STROKE]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
  },
  [OBJECT_PROPERTY_META.FADE]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
  },
  [OBJECT_PROPERTY_META.FILL]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
  },
  [OBJECT_PROPERTY_META.IMAGE]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
  },
  [OBJECT_PROPERTY_META.ROTATE]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
  },
  [OBJECT_PROPERTY_META.SCALE]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
  },
  [OBJECT_PROPERTY_META.TEXT]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
  },
} as const;

export const supportRect = <T extends QueueObjectType>(
  object: T,
): object is T & WithRect => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_META.RECT][object.type];
};

export const supportStroke = <T extends QueueObjectType>(
  object: T,
): object is T & WithStroke => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_META.STROKE][object.type];
};

export const supportFade = <T extends QueueObjectType>(
  object: T,
): object is T & WithFade => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_META.FADE][object.type];
};

export const supportFill = <T extends QueueObjectType>(
  object: T,
): object is T & WithFill => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_META.FILL][object.type];
};

export const supportImage = <T extends QueueObjectType>(
  object: T,
): object is T & WithImage => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_META.IMAGE][object.type];
};

export const supportRotation = <T extends QueueObjectType>(
  object: T,
): object is T & WithRotation => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_META.ROTATE][object.type];
};

export const supportScale = <T extends QueueObjectType>(
  object: T,
): object is T & WithScale => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_META.SCALE][object.type];
};

export const supportText = <T extends QueueObjectType>(
  object: T,
): object is T & WithText => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_META.TEXT][object.type];
};
