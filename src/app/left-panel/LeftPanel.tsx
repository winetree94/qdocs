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
