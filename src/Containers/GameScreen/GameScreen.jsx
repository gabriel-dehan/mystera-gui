import React, { Component, Fragment } from 'react';
import { remote }  from 'electron';

import { 
  Game, 
  Container 
} from './GameScreenStyles.jsx'

const { robot } = remote.getCurrentWindow();

class GameScreen extends Component {
  onClick(e) {   
    robot.mouseMove(150, 150)
      .press("tab")
      .sleep(50)
      .release("tab")
      .press("enter")
      .sleep(50)
      .release("enter")
      .sleep(100)
      .typeString("Hello World!")
      .go(function() {
        console.log('MOVED');
      })
  }

  render() {
    return (
      <Container>
        <Game 
          src='https://www.mysteralegacy.com/play/full.php' 
          frameBorder='0'>
        </Game>
        <button onClick={(e) => this.onClick(e)}>CLICK ME MOFO</button>
      </Container>
    );
  }
}

export default GameScreen;