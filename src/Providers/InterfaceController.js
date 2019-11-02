import React, { Component } from 'react';
import { remote }  from 'electron';

const CONSTANTS = {
  SKILL_MENU: 'skills' 
}

export class RobotController {
  constructor() {
    this.robot = remote.getCurrentWindow().robot;
  }
  
  // Used to on the game screen before inputing keyboard commands
  sceneFocus() {
    // A bit ugly but works very well without needing to pass the component;
    document.querySelector('iframe').contentWindow.focus();
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


