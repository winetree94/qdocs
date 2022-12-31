import styled from '@emotion/styled';

export const Object = styled.button`
  width: 50px;
  height: 50px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  background: none;

  &:hover {
    background: #eee;
  }

  &:active {
    background: #ddd;
  }
`;
