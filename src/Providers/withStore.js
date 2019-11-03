import React, { Component } from 'react';
import Store from 'electron-store';

const schema = {
	user: {
		server: null,
	},
};

export default (Child) => {
  return class ComponentWithStore extends Component {
    constructor() {
      super();
      this.store = new Store({schema});
    }

    render() {
      return (
        <Child {...this.props} store={this.store} />
      )
    }
  }
}
