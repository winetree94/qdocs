import { css } from '@emotion/css';
import { FunctionComponent } from 'react';
import { Input } from '../../components/input/Input';
import { Object } from '../../components/object/Object';
import { ObjectGrid } from '../../components/object/ObjectGrid';
import { ObjectGroup } from '../../components/object/ObjectGroup';
import { ObjectGroupTitle } from '../../components/object/ObjectGroupTitle';

export const LeftPanel: FunctionComponent = () => {
  return (
    <div
      className={css`
        width: 200px;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      `}
    >
      <Input
        placeholder="Search Shape"
        className={css`
          height: 36px;
          margin: 0 8px;
        `}
      ></Input>
      <ObjectGroup>
        <ObjectGroupTitle>Group Title</ObjectGroupTitle>
        <ObjectGrid>
          <Object>
            <svg
              version="1.1"
              baseProfile="full"
              xmlns="http://www.w3.org/2000/svg"
              className={css`
                margin: 10px;
                width: 30px;
                height: 30px;
              `}
            >
              <g>
                <rect
                  width="30"
                  height="30"
                  stroke="black"
                  strokeWidth="4"
                  fill="transparent"
                />
              </g>
            </svg>
          </Object>
        </ObjectGrid>
      </ObjectGroup>
      <ObjectGroup>
        <ObjectGroupTitle>Group Title</ObjectGroupTitle>
        <ObjectGrid>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
        </ObjectGrid>
      </ObjectGroup>
    </div>
  );
};
