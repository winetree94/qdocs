export interface QueueRectEffect extends QueueRectEditableProperties {
  duration: number;
}

export interface QueueRectEditableProperties {
  type: 'create' | 'update';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeDasharray: string;
}

export interface QueueRectObject {
  type: 'rect';
  uuid: string;
  effects: QueueRectEffect[];
}
