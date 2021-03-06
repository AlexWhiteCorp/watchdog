import {shell, ipcRenderer} from "electron";
import * as fs from "fs";
import * as os from "os";

const CONFIGS_FILE_PATH = os.homedir() + '/.watchdog/config.json'

window.appVersion = require('../package.json').version

window.logger = {
    debug: (source, msg) => {
        ipcRenderer.send('log-debug', [source, msg])
    },
    info: (source, msg) => {
        ipcRenderer.send('log-info', [source, msg])
    },
    error: (source, msg) => {
        ipcRenderer.send('log-error', [source, msg])
    },
}

window.getTrayPosition = async () => {
    return await ipcRenderer.invoke('get-tray-position')
}

window.log = (msg) => {
    ipcRenderer.send('console-log', msg)
}

window.openInBrowser = (link) => {
    return shell.openExternal(link)
}

window.loadConfigs = (callback) => {
    fs.readFile(CONFIGS_FILE_PATH, 'utf-8', (err, data) => {
        if(!err) {
            const fileData = data.replaceAll('\r\n', '');
            callback(null, JSON.parse(fileData))
        } else {
            callback(err, null)
        }
    });
}

window.setSize = (width, height) => {
    ipcRenderer.send('resize-window', [width, height])
}

window.hideWindow = () => {
    ipcRenderer.send('hide-window')
}

window.setAppIcon = (color) => {
    ipcRenderer.send('set-app-icon', color)
}

window.showNotification = (subtitle, body) => {
    ipcRenderer.send('show-notification', [subtitle, body])
}

window.quitApp = () => {
    ipcRenderer.send('quit-app')
}