import { StandaloneCircleObject } from '@legacy/model/standalone-object/circle';
import { StandaloneIconObject } from '@legacy/model/standalone-object/icon';
import { StandaloneImageObject } from '@legacy/model/standalone-object/image';
import { StandaloneLineObject } from '@legacy/model/standalone-object/line';
import { StandaloneSquareObject } from '@legacy/model/standalone-object/square';

export type StandaloneObject =
  | StandaloneSquareObject
  | StandaloneIconObject
  | StandaloneCircleObject
  | StandaloneLineObject
  | StandaloneImageObject;
