import React, { Component } from 'react';
import InterfaceController, { Symbols } from '../../Providers/InterfaceController';
import withStore from '../../Providers/withStore';

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
    friends: this.props.store.get('user.friends', [])
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
      const { store } = this.props;
      let friends = store.get('user.friends', []);
      
      friends = friends.filter((f) => f.name !== friend);

      store.set('user.friends', friends);
      this.setState({ friends });
    }
  }

  onAddClick() {
    const friend = this.state.userInput;

    if (friend.length > 0) {
      const { store } = this.props;
      let friends = store.get('user.friends', []);

      const friendExists = friends.some((f) => f.name === friend);

      if (!friendExists) {
        friends.unshift({ name: friend, relationship: 0 });
      }

      store.set('user.friends', friends);
      this.setState({ friends, userInput: '' });
      this.input.current.focus();
    }
  }

  onChatClick() {
    this.props.controller.initiateCommand(Symbols.WHISPER, [this.userInput, " "]);
  }

  render() {
    const { store } = this.props;
    const friends = store.get('user.friends', []);

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

export default withStore(InterfaceController(FriendsModule));