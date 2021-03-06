import React, { Component } from 'react';
import { observer, inject } from "mobx-react"
import withInterfaceHandlers, { Symbols } from '../../Providers/withInterfaceHandlers';

import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { 
  Container,
  GameContainer,
  Game, 
  Loader,
} from './GameScreenStyles.jsx'

class GameScreen extends Component {
  state = {
    loaded: false
  }

  loadingDelay = 1;// || 2500;

  componentDidMount() {
    // We can't listen to keyboard events in an iframe but we need to capture keys so we use java
    this.props.listener.start();
    this.props.listener.onExecuteCommand((command) => {
      // TODO: Need a mobx store
    });
    
    // Send the current game window to the Interface Handlers that they knows what to work on
    this.props.controller.setCurrentGameWindow(document.querySelector('iframe'));
  }

  componentWillUnmount() {
    this.props.listener.stop();
  }

  onClick(e) {   
    this.props.controller.execute(Symbols.SKILL_MENU);
  }

  onLoad() {
    setTimeout(() => this.setState({ loaded: true }), this.loadingDelay);
  }

  render() {
    return (
      <Container className="rpgui-content">
        {!this.state.loaded && 
        <Loader>Loading...</Loader>
        }
        <Header />
        <GameContainer>
          <Game 
            className="rpgui-container framed-dark"
            onLoad={(e) => this.onLoad(e)}
            src='https://www.mysteralegacy.com/play/full.php' 
            frameBorder='0'>
          </Game>
          <Sidebar />
        </GameContainer>
      </Container>
    );
  }
}

export default inject("settings")(withInterfaceHandlers(observer(GameScreen)));