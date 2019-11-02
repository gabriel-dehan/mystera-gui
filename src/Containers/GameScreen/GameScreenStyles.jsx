import styled from 'styled-components';

export const Loader = styled.div`
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  background: black;
  color: white;
  z-index: 1000;

  padding-top: 40vh;
  font-size: 2em;
`;

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  background: black;
`;

export const GameContainer = styled.section`
  display: flex;
`;

export const Game = styled.iframe`
  height: calc(100vh - 70px);
  width: calc(100vw - 70px);

  body {
    background: initial;
  }
`;
