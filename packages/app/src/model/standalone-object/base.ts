import { StandaloneCircleObject } from 'model/standalone-object/circle';
import { StandaloneIconObject } from 'model/standalone-object/icon';
import { StandaloneImageObject } from 'model/standalone-object/image';
import { StandaloneLineObject } from 'model/standalone-object/line';
import { StandaloneSquareObject } from 'model/standalone-object/square';

export type StandaloneObject =
  | StandaloneSquareObject
  | StandaloneIconObject
  | StandaloneCircleObject
  | StandaloneLineObject
  | StandaloneImageObject;
