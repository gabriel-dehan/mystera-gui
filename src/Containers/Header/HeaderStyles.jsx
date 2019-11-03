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
  margin-right: 5px;

  ul.rpgui-dropdown-imp {
    width: 170px;
    text-align: left;
  }
`;

export const Play = styled.button`  
  margin-top: 1px;  
  height: 34px;
`;

export const Separator = styled.div`
  height: initial;
  border-right: 2px solid #4a4a4a;
  margin-right: 15px;
  margin-left: 15px;
  padding-bottom: 9px;
  margin-bottom: 4px;
`;