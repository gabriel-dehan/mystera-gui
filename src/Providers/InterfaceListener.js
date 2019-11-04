import React, { Component } from 'react';
import { remote }  from 'electron';
import electronLocalshortcut from 'electron-localshortcut';
import Mappings from '../Config/Mappings';
import { Controller } from './InterfaceController';

class KeyboardListener {
  LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O' ,'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  constructor() {
    this.mainWindow = remote.getCurrentWindow();
    this.controller = Controller;
    this.running = false;
  }

  start() {
    this.registerClickHandler();
    this.registerKeyboardHandler();

    // Object.keys(Mappings).map((key) => {
    //   electronLocalshortcut.register(this.mainWindow, key, () => {
    //     const { action, args } = Mappings[key];
    //     console.log(`Running ${this.controller[action]} with`, args);
    //     this.controller[action](...args);
    //   });
    // });
   
    // electronLocalshortcut.register(this.mainWindow, 'Enter', () => {
    //   console.log('Typing in chat');
    //   // When typing in chat pause MysteraGUI keyboard events
    //   this.stop();
    // });

    this.running = true;
  }

  stop() {
    Object.keys(Mappings).map((key) => {
      electronLocalshortcut.unregister(this.mainWindow, key);
    });

    this.running = false;
  }

  registerKeyboardHandler() {
    this.controller.addKeyboardListener((keys) => {
      if (this.mainWindow.isFocused()) {
        const keysArray = keys.split("+");
        let keystroke = keys;
        
        if (keysArray.length === 2 && keysArray[0] === "SHIFT") {
          keystroke = keysArray[1];
        } else if (keysArray.length === 1 && keys.length === 1) {
          // TODO: Handle accentued letters
          if (this.LETTERS.includes(keys)) {
            keystroke = keys.toLowerCase();
          }
        }
        console.log(keystroke);
      }
    });
  }

  unregisterKeyboardHandler() {
    this.controller.removeKeyboardListener();
  }

  registerClickHandler() {
    this.controller.addClickListener((coords) => {
      if (this.mainWindow.isFocused()) {
        const { border } = this.mainWindow.baseGameWindow;
        const windowArea = this.mainWindow.getBounds();

        const xOrigin = windowArea.x;
        const yOrigin = windowArea.y + (windowArea.height - this.mainWindow.getContentSize()[1]); 

        let { left, top, right, bottom } = this.controller.gameWindow;

        left += xOrigin + border;
        right += xOrigin + border;
        top += yOrigin + border;
        bottom += yOrigin + border;

        const clickInBounds = coords.x >= left && coords.x <= right && coords.y >= top && coords.y <= bottom;

        if (clickInBounds) {
          console.log('Clicked in game window', coords);
        }
      }
    });
  }

  unregisterClickHandler() {
    this.controller.removeClickListener();
  }

  commandAnalyzer() {
    // Todo should check if iframe is focused maybe or force focus
    // electronLocalshortcut.register(this.mainWindow, '/', () => {
    //   // Unregister the enter because we now want it to validate
    //   electronLocalshortcut.unregister(this.mainWindow, 'Enter');

    //   console.log('Registering command');
    //   this.currentCommand = [];

    //   // When entering commands pause MysteraGUI keyboard events
    //   this.stop();

    //   const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O' ,'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Space'];
    //   letters.map((l) => electronLocalshortcut.register(this.mainWindow, l, () => this.currentCommand.push(l)));

    //   const unregisterAll = () => {
    //     electronLocalshortcut.unregister(this.mainWindow, 'Enter');
    //     electronLocalshortcut.unregister(this.mainWindow, '/');
    //     letters.map((l) => electronLocalshortcut.unregister(this.mainWindow, l));
    //   }

    //   electronLocalshortcut.register(this.mainWindow, 'Esc', () => {
    //     console.log('Canceling', this.currentCommand);
    //     this.currentCommand = [];

    //     unregisterAll();
    //     // Restart listening to MysteraGUI keyboard events
    //     this.start();
    //   });

    //   electronLocalshortcut.register(this.mainWindow, 'Enter', () => {
    //     console.log('Validating command', this.currentCommand);
    //     this.currentCommand = [];

    //     unregisterAll();
    //     // Restart listening to MysteraGUI keyboard events
    //     this.start();

    //   });
    // });
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
        <Child {...this.props} listener={this.listener} />
      )
    }
  }
}


