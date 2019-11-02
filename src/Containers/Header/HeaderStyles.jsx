import styled from 'styled-components';

export const Container = styled.header`
  position: relative;
  height: 70px;
  width: 100%;
`;

export const Column = styled.div`
  margin-top: 3px;
  float: ${props => props.right ? 'right' : 'initial'};
  display: flex;
`;

export const ServerSelect = styled.div`
  margin-right: 15px;

  ul.rpgui-dropdown-imp {
    width: 170px;
    text-align: left;
  }
`;
