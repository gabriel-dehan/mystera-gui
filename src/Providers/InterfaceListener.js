import React, { Component } from 'react';
import { remote }  from 'electron';
import { remove, isString, isRegExp, isEmpty } from 'lodash';
import Mappings from '../Config/Mappings';
import { Controller } from './InterfaceController';

class Analyzer {
  constructor() {
    this.leftClickListener = null;
    this.listeners = [];
    this.commandListener = null;
    this.typing = false;
    this.command = null;
  }

  start() {
    this.chat();
    this.commands();
  }

  stop() {
    this.leftClickListener = null;
    this.listeners = [];
    this.commandListener = null;
    this.typing = false;
    this.command = null;
  }

  onExecuteCommand(callback) {
    this.commandListener = callback;
  }

  offExecuteCommand() {
    this.offExecuteCommand();
  }
  
  sendClick(coordinates) {
    if (this.leftClickListener) {
      this.leftClickListener(coordinates, this.leftClickListener);
    }
  }

  onLeftClick(callback) {
    this.leftClickListener = callback;
  }

  offLeftClick() {
    this.leftClickListener = null;
  }

  sendKeys(key) {
    const keyListeners = this.listeners.filter((listener) => {
      if (isRegExp(listener.trigger)) {
        return key.match(listener.trigger);
      } else {
        return listener.trigger.toUpperCase() === key.toUpperCase();
      }
    });
    keyListeners.forEach((listener) => { listener.callback(key, listener); })
  }

  registerListener(trigger, callback) {
    const listener = {
      trigger: trigger,
      callback,
    };
    
    this.listeners.push(listener);

    return listener;
  }

  unregisterListener(keyOrListener) {
    if (isString(keyOrListener)) {
      remove(this.listeners, (listener) => listener.trigger.toUpperCase() === keyOrListener.toUpperCase());
    } else {
      remove(this.listeners, (listener) => listener === keyOrListener);
    }
  }

  onChatActive() {
    // TODO: Stop registering shortcuts 
    // TODO: Refacto
    const escapeListener = this.registerListener('ESCAPE', () => {
      console.log('Closing chat');
      this.typing = false;
      this.command = null;

      this.offLeftClick();
      this.unregisterListener(escapeListener);
    });

    this.onLeftClick(() => {
      console.log('Closing chat');
      this.typing = false;
      this.command = null;

      this.offLeftClick();
      this.unregisterListener(escapeListener);
    });
  }

  chat() {
    this.registerListener('ENTER', () => {
      if (this.typing === false) {
        this.onChatActive();

        console.log('Typing in chat...');
        this.typing = true;
      } else {
        this.typing = false;
        
        if (this.command) {
          console.log('Validating command /' + this.command);
          if (this.commandListener) {
            this.commandListener(this.command);
          }
        }
      }
    });
  }

  commands() {
    this.registerListener('/', () => {
      if (this.typing === false) {
        this.onChatActive();
        this.typing = true; 
        this.command = "";
      } 

      if (isEmpty(this.command)) {
        console.log('Started command');
        this.registerListener(/(\w|SPACE){1}/, (key) => {
          if (key === "SPACE") {
            this.command += " ";
          } else {
            this.command += key;
          }
        })
      }
    });
  }

  // commandAnalyzer() {
  //   // Todo should check if iframe is focused maybe or force focus
  //   electronLocalshortcut.register(this.mainWindow, '/', () => {
  //     // Unregister the enter because we now want it to validate
  //     electronLocalshortcut.unregister(this.mainWindow, 'Enter');

  //     console.log('Registering command');
  //     this.currentCommand = [];

  //     // When entering commands pause MysteraGUI keyboard events
  //     this.stop();

  //     const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O' ,'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Space'];
  //     letters.map((l) => electronLocalshortcut.register(this.mainWindow, l, () => this.currentCommand.push(l)));

  //     const unregisterAll = () => {
  //       electronLocalshortcut.unregister(this.mainWindow, 'Enter');
  //       electronLocalshortcut.unregister(this.mainWindow, '/');
  //       letters.map((l) => electronLocalshortcut.unregister(this.mainWindow, l));
  //     }

  //     electronLocalshortcut.register(this.mainWindow, 'Esc', () => {
  //       console.log('Canceling', this.currentCommand);
  //       this.currentCommand = [];

  //       unregisterAll();
  //       // Restart listening to MysteraGUI keyboard events
  //       this.start();
  //     });

  //     electronLocalshortcut.register(this.mainWindow, 'Enter', () => {
  //       console.log('Validating command', this.currentCommand);
  //       this.currentCommand = [];

  //       unregisterAll();
  //       // Restart listening to MysteraGUI keyboard events
  //       this.start();

  //     });
  //   });
  // }
}

class Listener {
  LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O' ,'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  constructor() {
    this.mainWindow = remote.getCurrentWindow();
    this.controller = Controller;
    this.running = false;
    this.analyzer = new Analyzer();
  }

  start() {
    this.registerClickHandler();
    this.registerKeyboardHandler();
    this.analyzer.start();

    // Object.keys(Mappings).map((key) => {
    //   electronLocalshortcut.register(this.mainWindow, key, () => {
    //     const { action, args } = Mappings[key];
    //     console.log(`Running ${this.controller[action]} with`, args);
    //     this.controller[action](...args);
    //   });
    // });
  
    this.running = true;
  }

  stop() {
    // Object.keys(Mappings).map((key) => {
    //   electronLocalshortcut.unregister(this.mainWindow, key);
    // });
    this.unregisterClickHandler();
    this.unregisterKeyboardHandler();
    this.analyzer.stop();

    this.running = false;
  }

  onExecuteCommand(callback) {
    this.analyzer.onExecuteCommand(callback);
  }

  gameWindowIsFocused() {
    return document.activeElement === document.querySelector('iframe');
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
        // console.log(keystroke);
        if (this.gameWindowIsFocused()) {
          this.analyzer.sendKeys(keystroke)
        }
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
          if (this.gameWindowIsFocused()) {
            this.analyzer.sendClick(coords);
          }
        }
      }
    });
  }

  unregisterClickHandler() {
    this.controller.removeClickListener();
  }

  // commandAnalyzer() {
  //   if (this.mainWindow.isFocused() && this.gameWindowIsFocused()) {
  //      electronLocalshortcut.register(this.mainWindow, '/', () => {
  //      });
  //   }
  // }
}

export default (Child) => {
  return class InterfaceListener extends Component {
    constructor() {
      super();
      this.listener = new Listener();
    }

    render() {
      return (
        <Child {...this.props} listener={this.listener} />
      )
    }
  }
}


