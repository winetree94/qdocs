import styled from '@emotion/styled';

export const Button = styled.button`
  background-color: transparent;
  border: 0;
  transition: all 0.1s ease-in-out;
  display: flex;
  flex: 1 1 auto;

  &:hover {
    background: #eee;
  }

  &:active {
    background: #fff;
  }

  &.border {
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
`;
