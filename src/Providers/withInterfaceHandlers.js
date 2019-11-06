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
    }

    render() {
      return (
        <Child {...this.props} listener={this.listener} controller={this.controller} />
      )
    }
  }
}



