import React, { Component } from 'react';
import { remote }  from 'electron';

const CONSTANTS = {
  SKILL_MENU: 'skills',
  WHISPER: 't',
  ADD_FRIEND: 'friend add',
  REMOVE_FRIEND: 'friend remove',
  QUESTS: 'quests',
}

// Not ideal, needs DOM to work
class RobotController {
  constructor() {
    this.mainWindow = remote.getCurrentWindow();
    this.robot = this.mainWindow.robot;
    this.cursorPosition = null;
    this.baseGameWindow = this.mainWindow.baseGameWindow;
  }

  setCurrentGameWindow(gameWindowElement) {
    this.gameWindow = gameWindowElement.getBoundingClientRect();
    
    // Remove the border of the iframe, ugly I know
    this.gameWindow.width -= this.baseGameWindow.border * 2;
    // No need for -24 because we are recomputing the height based on the game ratio (the iframe height is incorrect sometimes)
    this.gameWindow.height = this.gameWindow.width / this.baseGameWindow.ratio;

  }

  addClickListener(listener) {
    this.robot.registerClickListener(listener);
  }

  removeClickListener() {
    this.robot.unregisterClickListener();
  }

  addKeyboardListener(listener) {
    this.robot.registerKeyboardListener(listener);
  }

  removeKeyboardListener() {
    this.robot.unregisterKeyboardListener();
  }
  
  _positionToRelative(x, y) {
    const windowArea = this.mainWindow.getBounds();

    const xOrigin = windowArea.x;
    const yOrigin = windowArea.y + (windowArea.height - this.mainWindow.getContentSize()[1]); 
    
    x = xOrigin + x + this.gameWindow.x;
    y = yOrigin + y + this.gameWindow.y;

    return { x, y };
  }

  // Rescale the given coordinates according to the app window's size relative to a given base
  // That's because all coordinates registered in config files were recorded relative to the subcited base
  _scaledCoordinates(xPos, yPos) {
    // Mandatory in case of resize :'(
    this.setCurrentGameWindow(document.querySelector('iframe'));

    const scaledX = xPos / (this.baseGameWindow.width / this.gameWindow.width);
    const scaledY = yPos / (this.baseGameWindow.height / this.gameWindow.height);

    const { x, y } = this._positionToRelative(scaledX, scaledY);

    return { x: Math.round(x), y: Math.round(y) };
  }

  // this.props.controller.moveCursorRelatively(x, y).go();
  moveCursorRelatively(xPos, yPos) {
    const { x, y } = this._scaledCoordinates(xPos, yPos);

    return this.robot.mouseMove(x, y);
  }

  setRelativeCursorPosition(x, y) {
    this.moveCursorRelatively(x, y)
      .go(() => console.log(`Mouse moved to ${x}, ${y}`));
  }

  setTemporaryCursorPosition(x, y, otherAction) {
    const previousPosition = this.saveCursorPosition();

    this.moveCursorRelatively(x, y)
      .delay();

    if (otherAction) {
      otherAction();
    }
    
    this.robot
      .delay()
      .mouseMove(previousPosition.x, previousPosition.y)
      .go();

    this.clearCursorPosition()
  }

  wait(amount) {
    this.robot.sleep(amount);
  }


  leftClick() {
    return this.robot.mouseClick(1);
  }
  
  rightClick() {
    return this.robot.mouseClick(2);
  }

  clickThenGoBack(x, y, sleep) {
    this.setTemporaryCursorPosition(x, y, () => {
      return this.leftClick();
    });
  }

  saveCursorPosition() {
    return this.cursorPosition = this.mainWindow.getCursorPosition();
  }

  clearCursorPosition() {
    return this.cursorPosition = null;
  }

  // Used to on the game screen before inputing keyboard commands
  gameFocus() {
    // A bit ugly but works very well without needing to pass the component;
    document.querySelector('iframe').contentWindow.focus();
  }

  initiateCommand(command, args = [], callback = null) {
    this.gameFocus();
    
    const commandWithArgs = args.length > 0 ? `${command} ${args.join(' ')}` : `${command}`;

    this.robot
      .press("/")
      .delay()
      .release("/")
      .delay()
      .typeString(`${commandWithArgs}`)
      .go(function() {
        console.log(`Command ${commandWithArgs} initiated!`);
        if (callback) {
          callback();
        }
      });
  }

  execute(command, args = [], callback = null) {
    this.gameFocus();
    
    const commandWithArgs = args.length > 0 ? `${command} ${args.join(' ')}` : `${command}`;

    this.robot
      .press("/")
      .delay()
      .release("/")
      .delay()
      .typeString(`${commandWithArgs}`)
      .press("enter")
      .delay()
      .release("enter")
      .go(function() {
        console.log(`Command ${commandWithArgs} executed!`);
        if (callback) {
          callback();
        }
      });
  }
}

export const Symbols = CONSTANTS;
export const Controller = new RobotController();

export default (Child) => {
  return class InterfaceController extends Component {
    constructor() {
      super();
      this.controller = Controller;
    }

    render() {
      return (
        <Child {...this.props} controller={this.controller} />
      )
    }
  }
}



