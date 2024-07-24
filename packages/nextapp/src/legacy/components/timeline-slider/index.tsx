import { useState } from 'react';
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';

import SliderRail from './components/SliderRail';
import Track from './components/Track';
import Tick from './components/Tick';
import Handle from './components/Handle';

import './styles/index.scss';

const TimeRange = () => {
  /**
   * mode
   * - 1: 핸들이 서로 교차 가능
   * - 2: 핸들이 교차하지 않고, 한 단계씩 분리
   * - 3: 핸들을 밀 수 있고, 간격 유지
   * step: 한번에 이동할 값의 크기
   * domain: 슬라이더의 최소값, 최대값
   */
  const defaultState: {
    values: ReadonlyArray<number>;
    update: ReadonlyArray<number>;
    domain: ReadonlyArray<number>;
    disabled: boolean;
  } = {
    values: [0, 24],
    update: [0, 24],
    domain: [0, 50],
    disabled: false,
  };
  const [state, setState] = useState(defaultState);

  const domain = [0, 100];

  const onUpdate = (update: ReadonlyArray<number>) => {
    // 드래그시 다량 업데이트
    console.log('update: ', update);
    // setState({ ...state, update });
  };

  const onChange = (values: ReadonlyArray<number>) => {
    console.log('values: ', values);
    setState({ ...state, values });
    setState({ ...state, values, update: values });
  };

  return (
    <div className={'react_time_range__time_range_container'}>
      <Slider
        mode={1}
        step={1}
        disabled={state.disabled}
        domain={state.domain}
        onUpdate={onUpdate}
        onChange={onChange}
        values={state.values}
        rootStyle={{ position: 'relative', width: '100%' }}>
        <Rail>{({ getRailProps }) => <SliderRail {...getRailProps()} />}</Rail>

        <Handles>
          {({ handles, getHandleProps }) => {
            return (
              <>
                {handles.map((handle) => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </>
            );
          }}
        </Handles>

        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <>
              {tracks?.map(({ id, source, target }) => (
                <Track
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </>
          )}
        </Tracks>

        <Tracks left={false} right={false}>
          {({ getTrackProps }) => (
            <Track
              key={'aa'}
              source={{ value: 40, percent: 90 }}
              target={{ value: 20, percent: 80 }}
              getTrackProps={getTrackProps}
            />
          )}
        </Tracks>

        <Ticks count={5}>
          {({ ticks }) => (
            <>
              {ticks.map((tick) => (
                <Tick key={tick.id} tick={tick} count={ticks.length} />
              ))}
            </>
          )}
        </Ticks>
      </Slider>
    </div>
  );
};

export default TimeRange;
