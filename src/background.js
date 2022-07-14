'use strict'

import {app, protocol, BrowserWindow, ipcMain, Notification} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import TrayWindow from "@/tray-window";
import * as path from "path";
import {isWindows} from "@/utils";

const TRAY_ICON_BLACK_PATH = path.join(__static, 'icons/logo_black@2x.png')
const TRAY_ICON_BLUE_PATH = path.join(__static, 'icons/logo_blue@2x.png')

const isDevelopment = process.env.NODE_ENV !== 'production'

let window

async function createWindow() {
  const window = new BrowserWindow({
    frame: false,
    skipTaskbar: true,
    roundedCorners: false,
    transparent: true,
    resizable: false,
    minHeight: 500,
    webPreferences: {
      devTools: isDevelopment,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  //window.webContents.openDevTools()
  window.hide()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await window.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    await window.loadURL('app://./index.html')
  }

  return window;
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

app.dock.hide()

ipcMain.on('resize-window', (event, args) => {
  console.log('Resize: ' + args)
  if(window) {
    window.setSize(Math.round(args[1]), Math.round(args[2]))
  }
})

ipcMain.on('hide-window', () => {
  console.log('Hide window')
  window.hide();
  if(isWindows()) {
    window.minimize();
  }
  app.hide()
})

ipcMain.on('console-log', (event, args) => {
  console.log(args)
})

ipcMain.on('show-notification', (event, args) => {
  console.log('Notification: ' + args)
  new Notification({
    title: 'WatchDog',
    subtitle: args[0],
    body: args[1]}
  ).show()
})

ipcMain.on('set-app-icon', (event, color) => {
  const tray = TrayWindow.getTray()
  if(color === 'BLUE') {
    tray.setImage(TRAY_ICON_BLUE_PATH)
  }
  else {
    tray.setImage(TRAY_ICON_BLACK_PATH)
  }
})

ipcMain.on('quit-app', () => {
  app.exit(0)
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  window = await createWindow()
  TrayWindow.init({
    trayIconPath: TRAY_ICON_BLACK_PATH,
    window: window
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (isWindows()) {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}