const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');
const robot = require("../src/Vendor/kbm-robot/kbm-robot");

let mainWindow;

function createWindow() {
  robot.startJar(app.getAppPath());
  

  mainWindow = new BrowserWindow({
    width: 900, 
    height: 680, 
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