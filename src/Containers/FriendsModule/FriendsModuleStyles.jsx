import styled from 'styled-components';

export const Container = styled.aside`
  width: 70px;
  position: absolute;
  right: 55px;
  top: -1px;
  width: 250px;
  height: 260px;
  padding: 15px;
  
  /* Allows overrides */
  &.rpgui-container {
    border-width: 7px !important;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export const InputContainer = styled.div`
  position: relative;

  &::before {
    content: url(${props => props.icon});
    position: absolute;
    top: 10px;
    transform: scale(1.5);
    left: 12px;
    opacity: 0.6;
  }
`;


export const Input = styled.input`
  padding-left: 40px !important;
  color: #ececec !important;
  padding-top: 1px;

  &::placeholder { 
    color: #ececec;
    opacity: 1; 
  }
`;

export const FriendsList = styled.ul`
  max-height: 100px;
  margin-top: 15px;

  &:hover {
    color: white;
  }

  li {
    line-height: 17px;
    position: relative
    text-align: left;

    &:hover {
      background: radial-gradient(#58585882, transparent);
      background-position-y: 3px;
      color: inherit;
    }
  }
`;

export const Delete = styled.span`
  position: absolute;
  right: 6px;
  top: 4px;
  color: #ab0e0e !important;

  &:hover {
    color: #860c0c !important;
  }
`;
