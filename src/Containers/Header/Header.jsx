import React, { Component } from 'react';
import { observer, inject } from "mobx-react"
import InterfaceController, { Symbols } from '../../Providers/InterfaceController';
import UI from '../../Config/UIMappings';

import Button from '../../Components/Button/Button';
import HelpWindow from '../../Components/HelpWindow/HelpWindow';

import { 
  Container,
  Column,
  ServerSelect,
  Play,
  Separator
} from './HeaderStyles.jsx'

import Help from '../../Assets/Images/Icons/help.png'

class Header extends Component {
  constructor(props) {
    super(props);
    
    this.serverSelect = React.createRef();
  }

  state = {
    displayHelp: false,
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

  render() {
    const defaultServer = this.props.settings.server;
        
    return (
      <Container className="rpgui-container framed-dark-grey">
        {this.state.displayHelp && 
        <HelpWindow onClose={() => this.toggleHelp()} />
        }

        <Column right>
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

export default inject("settings")(InterfaceController(observer(Header)));