import styled from 'styled-components';

export const Container = styled.header`
  position: relative;
  height: 70px;
  width: 100%;
`;

export const Column = styled.div`
  margin-top: 3px;
  float: ${props => props.right ? 'right' : 'initial'};
`;

