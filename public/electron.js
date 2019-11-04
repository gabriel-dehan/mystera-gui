const { BrowserWindow, app, screen } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const robot = require("../src/Vendor/kbm-handler/kbm-robot");

let mainWindow;

function createWindow() {
  robot.startJar(app.getAppPath());
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width, 
    height: height, 
    minWidth: 840,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.maximize();
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on('closed', () => mainWindow = null);
  
  mainWindow.robot = robot;
  mainWindow.getCursorPosition = () => screen.getCursorScreenPoint();
  mainWindow.baseGameWindow = { 
    border: 12,
    width: 930,
    height: 522.66,
    ratio: 930 / 522.66
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  robot.stopJar(app.getAppPath());
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});