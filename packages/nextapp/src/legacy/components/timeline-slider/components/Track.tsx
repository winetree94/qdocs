import { TrackProps } from '../models/TimelineSlider.model';

const getTrackConfig = ({
  error,
  source,
  target,
  disabled,
}: Partial<TrackProps>) => {
  const basicStyle = {
    left: `${source.percent}%`,
    width: `calc(${target.percent - source.percent}% - 1px)`,
  };

  if (disabled) return basicStyle;

  const coloredTrackStyle = error
    ? {
        backgroundColor: 'rgba(214,0,11,0.5)',
        borderLeft: '1px solid rgba(214,0,11,0.5)',
        borderRight: '1px solid rgba(214,0,11,0.5)',
      }
    : {
        backgroundColor: '#7D7EFF',
        borderRadius: '8px',
      };

  return { ...basicStyle, ...coloredTrackStyle };
};

const Track = ({
  error,
  source,
  target,
  getTrackProps,
  disabled,
}: TrackProps) => (
  <div
    className={`react_time_range__track${disabled ? '__disabled' : ''}`}
    style={getTrackConfig({ error, source, target, disabled })}
    {...getTrackProps()}
  />
);

export default Track;
