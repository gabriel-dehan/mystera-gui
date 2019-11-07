import { remove, isString, isRegExp, isEmpty } from 'lodash';

export default class Analyzer {
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
}