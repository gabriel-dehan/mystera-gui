import React, { Component } from 'react';
import { observer, inject } from "mobx-react"
import withInterfaceHandlers, { Symbols } from '../../Providers/withInterfaceHandlers';

import Button from '../../Components/Button/Button';

import { 
  Container,
  Actions,
  InputContainer,
  Input,
  FriendsList,
  Delete,
} from './FriendsModuleStyles.jsx'

import User from '../../Assets/Images/Icons/person.png'

// @interfaceController
class FriendsModule extends Component {
  constructor(props) {
    super(props);

    this.input = React.createRef();
  }

  state = {
    friendsModule: false,
    userInput: '',
    friends: this.props.user.friends
  }

  componentDidMount() {
    this.input.current.focus();
  }
  
  toggleFriendsModule() {
    this.setState({ friendsModule: !this.state.friendsModule });
  }  

  selectUser(user) {
    this.setState({ userInput: user });
  }

  removeFriend(friend) {
    if (friend.length > 0) {
      const { user } = this.props;
      let friends = user.friends;
      
      friends = friends.filter((f) => f.name !== friend);

      this.setState({ friends });

      this.props.controller.execute(Symbols.REMOVE_FRIEND, [friend], () => {
        user.setFriends(friends);
      });
    }
  }

  onAddClick() {
    const friend = this.state.userInput;

    if (friend.length > 0) {
      const { user } = this.props;
      let friends = user.friends;

      const friendExists = friends.some((f) => f.name === friend);

      if (!friendExists) {
        friends.unshift({ name: friend, relationship: 0 });
      }

      this.setState({ friends, userInput: '' });

      // TODO: IMPORTANT -> PAUSE THE COMMAND ANALYZER 
      this.props.controller.execute(Symbols.ADD_FRIEND, [this.state.userInput], () => {
        user.setFriends(friends);
        this.input.current.focus();
      });
    }
  }

  onChatClick() {
    this.props.controller.gameFocus();
    this.props.controller.initiateCommand(Symbols.WHISPER, [this.state.userInput, " "]);
  }

  render() {
    const { user: { friends } } = this.props;

    return (
      <Container className="rpgui-container framed-dark-black">
        <InputContainer icon={User}>
          <Input 
            ref={this.input}
            type="text" 
            onChange={(e) => this.setState({ userInput: e.target.value })} 
            value={this.state.userInput} 
            placeholder="_" />
        </InputContainer>
        <Actions>
          <Button type="secondary" action={() => this.onAddClick()}>Add</Button>
          <Button type="secondary" action={() => this.onChatClick()}>Chat</Button>
        </Actions>
        <FriendsList className="rpgui-list-imp">
          {friends.map((friend) => 
            <li key={friend.name} onClick={() => this.selectUser(friend.name)}>
              {friend.name} 
              <Delete onClick={() => this.removeFriend(friend.name)}>X</Delete>
            </li>
          )}
        </FriendsList>
      </Container>
    );
  }
}

export default inject("user")(withInterfaceHandlers(observer(FriendsModule)));