import { SliderRailProps } from '../models/TimelineSlider.model';

export const SliderRail = ({ getRailProps }: SliderRailProps) => (
  <>
    <div className="react_time_range__rail__outer" {...getRailProps} />
    <div className="react_time_range__rail__inner" />
  </>
);

export default SliderRail;
