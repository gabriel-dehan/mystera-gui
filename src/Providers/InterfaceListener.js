import { remote }  from 'electron';
import Mappings from '../Config/Mappings';
import Analyzer from '../Lib/Analyzer';

class InterfaceListener {
  LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O' ,'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  constructor() {
    this.mainWindow = remote.getCurrentWindow();
    this.running = false;
    this.analyzer = new Analyzer();
  }

  setController(controller) {
    this.controller = controller;
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
}

const Listener = new InterfaceListener();

export default Listener;
