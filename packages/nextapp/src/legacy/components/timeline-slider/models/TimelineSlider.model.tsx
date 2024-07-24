/**
 * 함수 프로퍼티의 경우 테스트를 해본뒤 타입 확정할 예정
 */

export interface HandleTarget {
  id?: string;
  value: number;
  percent: number;
}

export interface HandleProps {
  domain: number[];
  handle: HandleTarget;
  disabled?: boolean;
  style?: Record<string, string>;
  error?: any;
  getHandleProps(id: string): any;
}

export interface TimeRangeProps {
  ticksNumber: number;
  selectedInterval?: any[];
  timelineInterval?: any[];
  disabledIntervals?: any[];
  containerClassName?: string;
  sliderRailClassName?: string;
  step?: number;
  error?: any;
  mode?: number;
  showNow?: boolean;
  formatTick?(ms: number): any;
  onUpdateCallback?(v: any): any;
  onChangeCallback?(v: any): any;
}

export interface SliderRailProps {
  getRailProps?: any;
}

export interface TrackProps {
  source: HandleTarget;
  target: HandleTarget;
  disabled?: boolean;
  error?: any;
  getTrackProps?(): any;
}

// TickProps 은 안쓰게 될 것 같음. 시간을 안쓸거라서
export interface TickProps {
  tick: HandleTarget;
  count: number;
  format?(value: any): any;
}
