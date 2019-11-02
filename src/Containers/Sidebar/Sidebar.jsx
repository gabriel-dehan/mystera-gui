import React, { Component } from 'react';
import InterfaceController, { Symbols } from '../../Providers/InterfaceController';
import { 
  Container,
} from './SidebarStyles.jsx'

// @interfaceController
class Sidebar extends Component {

  render() {
    return (
      <Container className="rpgui-container framed-dark-grey">
        
      </Container>
    );
  }
}

export default InterfaceController(Sidebar);