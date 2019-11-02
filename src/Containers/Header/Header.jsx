import React, { Component } from 'react';
import InterfaceController, { Symbols } from '../../Providers/InterfaceController';
import Button from '../../Components/Button/Button';
import HelpWindow from '../../Components/HelpWindow/HelpWindow';
import UIServersPositions from '../../Config/UIServersPositions';
import { 
  Container,
  Column,
  ServerSelect,
} from './HeaderStyles.jsx'
import Help from '../../Assets/Images/Icons/help.png'

class Header extends Component {
  constructor() {
    super();
    this.serverSelect = React.createRef();
  }
  state = {
    displayHelp: false
  }

  componentDidMount() {
    this.serverSelect.current.addEventListener('change', (e) => this.clickServer(e));
  }


  clickServer(e) {   
    const { x, y } = UIServersPositions[e.target.value].coordinates;
    
    this.props.controller.clickThenGoBack(x, y);
  }

  toggleHelp() {
    this.setState({ displayHelp: !this.state.displayHelp });
  }

  render() {
    return (
      <Container className="rpgui-container framed-dark-grey">
        {this.state.displayHelp && 
        <HelpWindow onClose={() => this.toggleHelp()} />
        }

        <Column right>
          <ServerSelect>
            <select className="rpgui-dropdown" ref={this.serverSelect}>
              {Object.keys(UIServersPositions).map((serverId) => {
                const server = UIServersPositions[serverId];
                return <option key={serverId} value={serverId}>{server.name}</option>;
              })}
            </select>
          </ServerSelect>
          <Button 
            icon={Help} 
            iconSize="small"
            action={() => this.toggleHelp()} 
            type="transparent" />
        </Column>
      </Container>
    );
  }
}

export default InterfaceController(Header);