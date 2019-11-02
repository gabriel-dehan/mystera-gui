import styled, { css } from 'styled-components';

export const Container = styled.article`

`;

export const Button = styled.button`
  background-color: transparent;
  border: none;
  padding: 0;
  
  img {
    ${props => props.iconSize === 'small' && css`
      max-width: 38px;
      max-height: 38px;
    `}
  }
`;
