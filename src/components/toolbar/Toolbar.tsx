import styled from '@emotion/styled';

export const Toolbar = styled.div`
  height: 30px;
  display: flex;
`;

export const ToolbarItem = styled.button`
  border: none;
  display: flex;
  background: none;
  align-items: center;
  justify-content: center;
  user-select: none;
  outline: none;

  padding: 10px; 20px;

  &:hover {
    background: #eee;
  }

  &:active {
    background: #ddd;
  }
`;
