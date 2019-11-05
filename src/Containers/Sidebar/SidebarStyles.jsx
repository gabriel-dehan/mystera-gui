import styled from 'styled-components';

export const Container = styled.aside`
  width: 70px;
  
  /* Allows overrides */
  &.rpgui-container {
    border-width: 7px !important;
    padding-top: 7px;
  }
`;

export const MenuItem = styled.div`
  position: relative;
`;