export interface QueueRotate {
  position: 'forward' | 'reverse';
  degree: number;
}

export interface WithRotation {
  rotate: QueueRotate;
}
