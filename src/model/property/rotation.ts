export interface QueueRotate {
  x: number;
  y: number;
  position: 'forward' | 'reverse';
  degree: number;
}

export interface WithRotation {
  rotate: QueueRotate;
}
