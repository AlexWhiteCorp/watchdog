const electron = require("electron")

const { ipcMain, Tray } = electron

const TOP_RIGHT = 'TOP_RIGHT'
const BOTTOM_RIGHT = 'BOTTOM_RIGHT'

let tray = undefined
let window = undefined
let platform = undefined

const margin = {
    x: -350,
    y: 0
}

const init = (options) => {
    createTray(options.trayIconPath)
    window = options.window
    platform = options.platform

    platform.hideWindow()

    tray.on("click", () => {
        ipcMain.emit("tray-window-clicked", { window: window, tray: tray })
        toggleWindow()
    })

    window.on("blur", () => {
        platform.hideWindow()
        ipcMain.emit("tray-window-hidden", { window: window, tray: tray })
    })

    window.on("close", function(event) {
        event.preventDefault()
        platform.hideWindow()
    })

    alignWindow()

    ipcMain.emit("tray-window-ready", { window: window, tray: tray })
    window.webContents.send('tray-position', getTrayPosition())
}

const createTray = (trayIconPath) => {
    tray = new Tray(trayIconPath)
}

const getTray = () => {
    return tray
}

const toggleWindow = () => {
    if (window.isVisible()) {
        platform.hideWindow()
        ipcMain.emit("tray-window-hidden", { window: window, tray: tray })
        return
    }

    platform.showWindow()
    ipcMain.emit("tray-window-visible", { window: window, tray: tray })
}

const alignWindow = () => {
    const position = calculateWindowPosition()
    window.setBounds({
        x: position.x,
        y: position.y
    })
}

const getTrayPosition = () => {
    const trayBounds = tray.getBounds()
    const screenBounds = electron.screen.getPrimaryDisplay().size

    return trayBounds.y > screenBounds.height / 2
        ? BOTTOM_RIGHT
        : TOP_RIGHT
}

const calculateWindowPosition = () => {
    const trayBounds = tray.getBounds()
    const [width, height] = window.getSize()

    const trayPos = getTrayPosition()

    let x, y

    switch (trayPos) {
        case TOP_RIGHT:
            x = Math.floor(trayBounds.x + trayBounds.width / 2 + margin.x)
            y = Math.floor(trayBounds.y + trayBounds.height / 2 + margin.y)
            break

        case BOTTOM_RIGHT:
            x = Math.floor(trayBounds.x + trayBounds.width / 2  + margin.x)
            y = Math.floor(trayBounds.y - height - trayBounds.height / 2 + margin.y)
            break
    }

    return { x: x, y: y }
}

module.exports = { init, getTray, alignWindow }