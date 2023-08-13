import { HandleProps } from '../models/TimelineSlider.model';

const Handle = ({
  error,
  domain,
  handle,
  disabled,
  getHandleProps,
}: HandleProps) => {
  const [min, max] = domain;
  const { id, value, percent = 0 } = handle;
  const leftPosition = `${percent}%`;

  // 드래그앤드롭조절바
  return (
    <>
      <div
        className="react_time_range__handle_wrapper"
        style={{ left: leftPosition }}
        {...getHandleProps(id)}
      />
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className={`react_time_range__handle_container${
          disabled ? '__disabled' : ''
        }`}
        style={{ left: leftPosition }}>
        <div
          className={`react_time_range__handle_marker${error ? '__error' : ''}`}
        />
      </div>
    </>
  );
};

export default Handle;
