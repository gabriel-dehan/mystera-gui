import React, { Component } from 'react';
import InterfaceController from '../../Providers/InterfaceController';
import Button from '../../Components/Button/Button';
import FriendsModule from '../FriendsModule/FriendsModule';

import { 
  Container,
  MenuItem,
} from './SidebarStyles.jsx'

import Friends from '../../Assets/Images/Icons/friends_plus.png'

// @interfaceController
class Sidebar extends Component {
  state = {
    friendsModule: false
  }
  
  toggleFriendsModule() {
    this.setState({ friendsModule: !this.state.friendsModule });
  }  

  render() {
    return (
      <Container className="rpgui-container framed-dark-grey">
        <MenuItem>
          <Button 
            icon={Friends} 
            iconWidth="30"
            iconHeight="32"
            action={() => {this.toggleFriendsModule()}} 
            type="primary" />
          {this.state.friendsModule && <FriendsModule />}
        </MenuItem>
       
      </Container>
    );
  }
}

export default InterfaceController(Sidebar);