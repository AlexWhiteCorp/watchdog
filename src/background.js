'use strict'

import {app, protocol, BrowserWindow, ipcMain, Notification} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import TrayWindow from "@/tray-window";
import * as path from "path";
import {isMac, isWindows} from "@/utils";
import WindowsPlatform from "@/platform/WindowsPlatform";
import MacOSPlatform from "@/platform/MacOSPlatform";

const APP_NAME = 'WatchDog'
const TRAY_ICON_BLACK_PATH = path.join(__static, 'icons/logo_black@2x.png')
const TRAY_ICON_BLUE_PATH = path.join(__static, 'icons/logo_blue@2x.png')

const isDevelopment = process.env.NODE_ENV !== 'production'

let window
let platform = isWindows()
    ? new WindowsPlatform()
    : isMac()
        ? new MacOSPlatform()
        : null

async function createWindow() {
  const window = new BrowserWindow({
    frame: false,
    skipTaskbar: true,
    roundedCorners: false,
    transparent: true,
    resizable: false,
    show: false,
    width: 700,
    height: 500,
    webPreferences: {
      devTools: isDevelopment,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  //window.webContents.openDevTools()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await window.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    await window.loadURL('app://./index.html')
  }

  return window;
}

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

ipcMain.on('resize-window', (event, args) => {
  console.log('Resize: ' + args)
  const [width, height] = args
  if(window) {
    platform.resizeWindow(width, height)
    TrayWindow.alignWindow()
  }
})

ipcMain.on('hide-window', () => {
  console.log('Hide window')
  platform.hideWindow()
})

ipcMain.on('console-log', (event, args) => {
  console.log(args)
})

ipcMain.on('show-notification', (event, args) => {
  const [subtitle, body] = args
  new Notification({
    title: APP_NAME,
    subtitle: subtitle,
    body: body
  }).show()
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
  platform.quitApp()
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
  platform.setWindow(window)
  platform.hideWindow()

  TrayWindow.init({
    trayIconPath: TRAY_ICON_BLACK_PATH,
    window: window,
    platform: platform
  })

  window.webContents.send("window-loaded", { loaded: true });
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (isWindows()) {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        platform.quitApp()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      platform.quitApp()
    })
  }
}