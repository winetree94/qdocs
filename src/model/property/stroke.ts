export interface QueueStroke {
  dasharray: string;
  width: number;
  color: string;
}

export interface WithStroke {
  stroke: QueueStroke;
}