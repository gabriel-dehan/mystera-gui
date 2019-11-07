import React, { Component } from 'react';
import Listener from './InterfaceListener';
import Controller, { Symbols as symbols } from './InterfaceController';

export const Symbols = symbols;

export default (Child) => {
  return class withInterfaceHandlers extends Component {
    constructor() {
      super();
      this.controller = Controller;
      this.listener = Listener;

      this.listener.setController(this.controller);
      this.controller.setListener(this.listener);
    }

    render() {
      return (
        <Child {...this.props} listener={this.listener} controller={this.controller} />
      )
    }
  }
}



