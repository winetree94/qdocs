// import { getMinutes } from 'date-fns';
import { TickProps } from '../models/TimelineSlider.model';

const Tick = ({ tick, count }: TickProps) => {
  // const isFullHour = !getMinutes(tick.value);

  const tickLabelStyle = {
    marginLeft: `${-(100 / count) / 2}%`,
    width: `${100 / count}%`,
    left: `${tick.percent}%`,
  };

  const tickMarkerStyle = {
    left: `calc(${tick.percent}% - 2px)`,
  };

  return (
    <>
      <div
        className={'react_time_range__tick_marker'}
        style={tickMarkerStyle}
      />
      <div className="react_time_range__tick_label" style={tickLabelStyle}>
        {tick.value}
      </div>
    </>
  );
};

export default Tick;
