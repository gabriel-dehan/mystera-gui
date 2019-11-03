import React, { Component } from 'react';
import { remote }  from 'electron';
import electronLocalshortcut from 'electron-localshortcut';
import Mappings from '../Config/Mappings';
import { Controller } from './InterfaceController';

class KeyboardListener {
  constructor() {
    this.mainWindow = remote.getCurrentWindow();
    this.controller = Controller;
  }
  
  setCurrentGameWindow(element) {
    this.controller.setCurrentGameWindow(element);
  }

  start() {
    Object.keys(Mappings).map((key) => {
      electronLocalshortcut.register(this.mainWindow, key, () => {
        const { action, args } = Mappings[key];
        console.log(`Running ${this.controller[action]} with`, args);
        this.controller[action](...args)
      });
    });
   
  }

  stop() {
    Object.keys(Mappings).map((key) => {
      electronLocalshortcut.unregister(this.mainWindow, key);
    });
  }
}

export default (Child) => {
  return class InterfaceListener extends Component {
    constructor() {
      super();
      this.listener = new KeyboardListener();
    }

    render() {
      return (
        <Child {...this.props} listener={this.listener} startListening={() => this.listener.start()} stopListening={() => this.listener.stop()} />
      )
    }
  }
}


