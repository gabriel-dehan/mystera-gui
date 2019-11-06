import React, { Component } from 'react';
import withInterfaceHandlers, { Symbols } from '../../Providers/withInterfaceHandlers';
import Button from '../../Components/Button/Button';
import FriendsModule from '../FriendsModule/FriendsModule';

import { 
  Container,
  MenuItem,
} from './SidebarStyles.jsx'

import Friends from '../../Assets/Images/Icons/friends_plus.png'
import Quests from '../../Assets/Images/Icons/quests.png'

// @interfaceController
class Sidebar extends Component {
  state = {
    friendsModule: false
  }
  
  toggleFriendsModule() {
    this.setState({ friendsModule: !this.state.friendsModule });
  }  

  toggleQuests() {
    this.props.controller.execute(Symbols.QUESTS);
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
        <MenuItem>
          <Button 
            icon={Quests} 
            iconWidth="30"
            iconHeight="30"
            action={() => {this.toggleQuests()}} 
            type="primary" />
        </MenuItem>
      </Container>
    );
  }
}

export default withInterfaceHandlers(Sidebar);