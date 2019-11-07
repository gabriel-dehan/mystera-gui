import React, { Component } from 'react';
import { observer, inject } from "mobx-react"
import withInterfaceHandlers, { Symbols } from '../../Providers/withInterfaceHandlers';
import UI from '../../Config/UIMappings';

import Button from '../../Components/Button/Button';
import HelpWindow from '../../Components/HelpWindow/HelpWindow';
import SettingsWindow from '../SettingsWindow/SettingsWindow';

import { 
  Container,
  Column,
  ServerSelect,
  Play,
  ExitButtonContainer,
  Separator
} from './HeaderStyles.jsx'

import Help from '../../Assets/Images/Icons/help.png'
import Exit from '../../Assets/Images/Icons/exit.png'
import Settings from '../../Assets/Images/Icons/settings.png'

class Header extends Component {
  constructor(props) {
    super(props);
    
    this.serverSelect = React.createRef();
  }

  state = {
    displayHelp: false,
    displaySettings: false,
    serverClicked: false,
  }

  componentDidMount() {
    this.serverSelect.current.addEventListener('change', (e) => this.selectServer(e));
  }

  selectServer(e) {   
    const serverId = e.target.value;
    this.props.settings.setServer(serverId);
  }

  clickServer() {
    const serverId =  this.props.settings.server;
    const { x, y } = UI.servers[serverId].coordinates;
    const loginX = UI.login.coordinates.x;
    const loginY = UI.login.coordinates.y;

    this.props.controller.clickThenGoBack(x, y);
    this.props.controller.wait(1000);
    this.props.controller.clickThenGoBack(loginX, loginY);

    this.setState({ serverClicked: true });
  }

  toggleHelp() {
    this.setState({ displayHelp: !this.state.displayHelp });
  }

  toggleSettings() {
    this.setState({ displaySettings: !this.state.displaySettings });
  }

  exitGame() {
    this.props.controller.execute(Symbols.QUIT);
  }

  render() {
    const defaultServer = this.props.settings.server;
        
    return (
      <Container className="rpgui-container framed-dark-grey">
        {this.state.displayHelp && 
        <HelpWindow onClose={() => this.toggleHelp()} />
        }
        {this.state.displaySettings && 
        <SettingsWindow onClose={() => this.toggleSettings()} />
        }

        <Column left>
          <React.Fragment>
            <ServerSelect>
              <select className="rpgui-dropdown" defaultValue={defaultServer} ref={this.serverSelect}>
                {Object.keys(UI.servers).map((serverId) => {
                  const server = UI.servers[serverId];
                  return <option key={serverId} value={serverId}>{server.name}</option>;
                })}
              </select>
            </ServerSelect>
            <Play onClick={() => this.clickServer()} disabled={this.state.serverClicked} className="rpgui-button">Go</Play>
          </React.Fragment>
        </Column>
        <Column right>
          <ExitButtonContainer>
            <Button 
              icon={Exit} 
              iconWidth="32"
              iconHeight="32"
              action={() => this.exitGame()} 
              type="simple" />
          </ExitButtonContainer>
          <Separator />
          <Button 
            icon={Settings} 
            iconWidth="38"
            iconHeight="38"
            action={() => this.toggleSettings()} 
            type="simple" />
          <Separator />
          <Button 
            icon={Help} 
            iconWidth="38"
            iconHeight="38"
            action={() => this.toggleHelp()} 
            type="simple" />
        </Column>
      </Container>
    );
  }
}

export default inject("settings")(withInterfaceHandlers(observer(Header)));