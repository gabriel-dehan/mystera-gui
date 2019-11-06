import { decorate, observable, action, computed } from 'mobx';
import autoSave from './StoreAutoSave';

class User {
  constructor() {
    autoSave(this, 'UserStore');
  }

  friends = [];

  setFriends(friends) {
    this.friends = friends;
  }
}

decorate(User, {
  friends: observable,
  setFriends: action,
})

const store = new User();

export default store; 