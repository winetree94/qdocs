import { OBJECT_TYPE, OBJECT_TYPES, QueueObjectType } from 'model/object';
import {
  OBJECT_PROPERTY_TYPE,
  OBJECT_PROPERTY_TYPES,
  WithFade,
  WithFill,
  WithImage,
  WithRect,
  WithRotation,
  WithScale,
  WithStroke,
  WithText,
} from 'model/property';

export const SUPPPORTED_PROPERTY_MAP: {
  [key in OBJECT_PROPERTY_TYPES]: {
    [key in OBJECT_TYPES]: boolean;
  };
} = {
  [OBJECT_PROPERTY_TYPE.RECT]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.GROUP]: true,
  },
  [OBJECT_PROPERTY_TYPE.STROKE]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.GROUP]: false,
  },
  [OBJECT_PROPERTY_TYPE.FADE]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.GROUP]: true,
  },
  [OBJECT_PROPERTY_TYPE.FILL]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.GROUP]: false,
  },
  [OBJECT_PROPERTY_TYPE.IMAGE]: {
    [OBJECT_TYPE.RECT]: false,
    [OBJECT_TYPE.ICON]: false,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: false,
    [OBJECT_TYPE.CIRCLE]: false,
    [OBJECT_TYPE.GROUP]: false,
  },
  [OBJECT_PROPERTY_TYPE.ROTATE]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.GROUP]: true,
  },
  [OBJECT_PROPERTY_TYPE.SCALE]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.GROUP]: true,
  },
  [OBJECT_PROPERTY_TYPE.TEXT]: {
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.GROUP]: true,
  },
} as const;

export const supportRect = <T extends QueueObjectType>(
  object: T,
): object is T & WithRect => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_TYPE.RECT][object.type];
};

export const supportRectAll = <T extends QueueObjectType>(
  objects: T[],
): objects is (T & WithRect)[] => {
  return objects.every((object) => supportRect(object));
};

export const supportStroke = <T extends QueueObjectType>(
  object: T,
): object is T & WithStroke => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_TYPE.STROKE][object.type];
};

export const supportStrokeAll = <T extends QueueObjectType>(
  objects: T[],
): objects is (T & WithStroke)[] => {
  return objects.every((object) => supportStroke(object));
};

export const supportFade = <T extends QueueObjectType>(
  object: T,
): object is T & WithFade => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_TYPE.FADE][object.type];
};

export const supportFadeAll = <T extends QueueObjectType>(
  objects: T[],
): objects is (T & WithFade)[] => {
  return objects.every((object) => supportFade(object));
};

export const supportFill = <T extends QueueObjectType>(
  object: T,
): object is T & WithFill => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_TYPE.FILL][object.type];
};

export const supportFillAll = <T extends QueueObjectType>(
  objects: T[],
): objects is (T & WithFill)[] => {
  return objects.every((object) => supportFill(object));
};

export const supportImage = <T extends QueueObjectType>(
  object: T,
): object is T & WithImage => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_TYPE.IMAGE][object.type];
};

export const supportImageAll = <T extends QueueObjectType>(
  objects: T[],
): objects is (T & WithImage)[] => {
  return objects.every((object) => supportImage(object));
};

export const supportRotation = <T extends QueueObjectType>(
  object: T,
): object is T & WithRotation => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_TYPE.ROTATE][object.type];
};

export const supportRotationAll = <T extends QueueObjectType>(
  objects: T[],
): objects is (T & WithRotation)[] => {
  return objects.every((object) => supportRotation(object));
};

export const supportScale = <T extends QueueObjectType>(
  object: T,
): object is T & WithScale => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_TYPE.SCALE][object.type];
};

export const supportScaleAll = <T extends QueueObjectType>(
  objects: T[],
): objects is (T & WithScale)[] => {
  return objects.every((object) => supportScale(object));
};

export const supportText = <T extends QueueObjectType>(
  object: T,
): object is T & WithText => {
  return SUPPPORTED_PROPERTY_MAP[OBJECT_PROPERTY_TYPE.TEXT][object.type];
};

export const supportTextAll = <T extends QueueObjectType>(
  objects: T[],
): objects is (T & WithText)[] => {
  return objects.every((object) => supportText(object));
};
