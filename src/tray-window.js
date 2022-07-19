const electron = require("electron")

const { ipcMain, Tray } = electron

const TOP_RIGHT = 'TOP_RIGHT'
const BOTTOM_RIGHT = 'BOTTOM_RIGHT'

let tray = undefined
let window = undefined
let platform = undefined

let margin

const init = (options) => {
    createTray(options.trayIconPath)
    window = options.window
    platform = options.platform

    platform.hideWindow()

    margin = platform.getMargin()

    tray.on("click", () => {
        if (platform.isWindowOpened()) {
            platform.hideWindow()
            return
        }

        platform.showWindow()
    })

    window.on("blur", () => {
        platform.onBlurWindow()
    })

    window.on("close", function(event) {
        event.preventDefault()
        platform.hideWindow()
    })

    alignWindow()

    ipcMain.emit("tray-window-ready", { window: window, tray: tray })
    ipcMain.handle('get-tray-position', () => {
        return getTrayPosition()
    })
}

const createTray = (trayIconPath) => {
    tray = new Tray(trayIconPath)
}

const getTray = () => {
    return tray
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
    const displayBounds = electron.screen.getPrimaryDisplay().size
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

    if(x + width > displayBounds.width) {
        x = displayBounds.width - width
    }

    return { x: x, y: y }
}

module.exports = { init, getTray, alignWindow }