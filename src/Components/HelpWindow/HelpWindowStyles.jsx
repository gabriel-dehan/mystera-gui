import styled from 'styled-components';

export const Container = styled.div`

  &.rpgui-container {
    position: absolute;
    min-width: 15vw;
    min-height: 15vh;
    top: 16px;
    right: 12px;
    z-index: 100;
  }
`;

export const CloseButton = styled.img`
  position: absolute;
  top: -26px;
  right: -26px;
`;


export const Content = styled.ul`
  padding-left: 0;
`;

export const Line = styled.li`
  margin-left: 0 !important;
  padding-bottom: 12px;
  margin-top: 12px;
  border-bottom: 2px solid #653912;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 500px;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    border: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

export const Action = styled.span`
  text-align: left;
  align-self: middle;
  padding-left: 5px;
`;

export const Keys = styled.span`
  display: flex;
  flex-direction: ${props => props.column ? 'column' : 'initial'};
  min-width: 70%;
  text-align: center;
`;

export const KeysBlock = styled.span`
  display: flex;
  flex-direction: ${props => props.column ? 'column' : 'initial'};
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  span {
    margin-right: 10px;
  }
`;


export const KeyIcon = styled.span`
  display: inline-block;
  background: url(${props => props.background});
  width: ${props => props.large ? '100px' : '32px'};
  height: 26px;
  background-size: ${props => props.large ? '100px 26px' : 'contain'};
  background-repeat: no-repeat;
  line-height: 1em;
  padding-top: 2px;
  padding-left: 1px;
  
`;
