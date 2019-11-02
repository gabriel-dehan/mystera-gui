import React, { Component } from 'react';
import { remote }  from 'electron';

const CONSTANTS = {
  SKILL_MENU: 'skills' 
}

export class RobotController {
  constructor() {
    this.mainWindow = remote.getCurrentWindow();
    this.robot = this.mainWindow.robot;
    this.cursorPosition = null;
  }
  
  _positionToRelative(x, y) {
    const windowArea = this.mainWindow.getBounds();
    const gameWindow =  document.querySelector('iframe').getBoundingClientRect();

    const xOrigin = windowArea.x;
    const yOrigin = windowArea.y + (windowArea.height - this.mainWindow.getContentSize()[1]); 
    
    x = xOrigin + x + gameWindow.x;
    y = yOrigin + y + gameWindow.y;

    return { x, y };
  }

  // Used to on the game screen before inputing keyboard commands
  sceneFocus() {
    // A bit ugly but works very well without needing to pass the component;
    document.querySelector('iframe').contentWindow.focus();
  }

  leftClick() {
    return this.robot.mouseClick(1);
  }
  rightClick() {
    return this.robot.mouseClick(2);
  }

  moveCursorRelatively(xPos, yPos) {
    const { x, y } = this._positionToRelative(xPos, yPos);

    return this.robot.mouseMove(x, y)
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

  clickThenGoBack(x, y) {
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

  execute(command) {
    this.sceneFocus();
    
    this.robot
      .press("/")
      .delay()
      .release("/")
      .delay()
      .typeString(`${command}`)
      .press("enter")
      .delay()
      .release("enter")
      .go(function() {
        console.log(`${command} executed!`);
      })
  }
}

export default (Child) => {
  return class InterfaceController extends Component {
    constructor() {
      super();
      this.controller = new RobotController();
    }

    render() {
      return (
        <Child {...this.props} controller={this.controller} />
      )
    }
  }
}

export const Symbols = CONSTANTS;


