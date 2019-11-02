import React, { Component } from 'react';
import InterfaceController, { Symbols } from '../../Providers/InterfaceController';
import Button from '../../Components/Button/Button';
import HelpWindow from '../../Components/HelpWindow/HelpWindow';
import { 
  Container,
  Column,
} from './HeaderStyles.jsx'
import Help from '../../Assets/Images/Icons/help.png'

class Header extends Component {
  state = {
    displayHelp: false
  }

  onClick(e) {   
    this.props.controller.execute(Symbols.SKILL_MENU);
  }

  toggleHelp() {
    this.setState({ displayHelp: !this.state.displayHelp });
    // 1.77777777778
  }

  render() {
    return (
      <Container className="rpgui-container framed-dark-grey">
        {this.state.displayHelp && 
        <HelpWindow onClose={() => this.toggleHelp()} />
        }

        <Column right>
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