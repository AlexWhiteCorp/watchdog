const electron = require("electron");

const { ipcMain, Tray } = electron;

let tray = undefined;
let window = undefined;

//defaults
let width = 100;
let height = 100;

let margin_x = 0;
let margin_y = 0;

const init = (options) => {
    createTray(options.trayIconPath)
    setWindow(options.window)

    tray.on("click", () => {
        ipcMain.emit("tray-window-clicked", { window: window, tray: tray });
        toggleWindow();
    });

    setWindowAutoHide();
    alignWindow();

    ipcMain.emit("tray-window-ready", { window: window, tray: tray });
}

const setWindowSize = (options) => {
    if (options.width) width = options.width;
    if (options.height) height = options.height;
    if (options.margin_x) margin_x = options.margin_x;
    if (options.margin_y) margin_y = options.margin_y;
}

const createTray = (trayIconPath) => {
    tray = new Tray(trayIconPath);
}

const getTray = () => {
    return tray
}

const setWindow = (newWindow) => {
    window = newWindow;
    setWindowSize(window.getBounds());
}

const setWindowAutoHide = () => {
    window.hide();
    window.on("blur", () => {
        if (!window.webContents.isDevToolsOpened()) {
            window.hide();
            ipcMain.emit("tray-window-hidden", { window: window, tray: tray });
        }
    });
    window.on("close", function(event) {
        event.preventDefault();
        window.hide();
    });
}

const toggleWindow = () => {
    if (window.isVisible()) {
        window.hide();
        ipcMain.emit("tray-window-hidden", { window: window, tray: tray });
        return;
    }

    showWindow();
    ipcMain.emit("tray-window-visible", { window: window, tray: tray });
}

const alignWindow = () => {
    const position = calculateWindowPosition();
    window.setBounds({
        x: position.x - 350,
        y: position.y
    });
}

const showWindow = () => {
    alignWindow();
    window.show();
}

const calculateWindowPosition = () => {
    const screenBounds = electron.screen.getPrimaryDisplay().size;
    const trayBounds = tray.getBounds();

    //where is the icon on the screen
    let trayPos; // 1:top-left 2:top-right 3:bottom-left 4.bottom-right
    if(trayBounds.y > screenBounds.height / 2) {
        trayPos = 3
    } else {
        trayPos = 1
    }

    let DEFAULT_MARGIN = { x: margin_x, y: margin_y };
    let x, y

    //calculate the new window position
    switch (trayPos) {
        case 1: // for TOP - LEFT
            x = Math.floor(trayBounds.x + DEFAULT_MARGIN.x + trayBounds.width / 2);
            y = Math.floor(trayBounds.y + DEFAULT_MARGIN.y + trayBounds.height / 2);
            break;

        case 2: // for TOP - RIGHT
            x = Math.floor(
                trayBounds.x - width - DEFAULT_MARGIN.x + trayBounds.width / 2
            );
            y = Math.floor(trayBounds.y + DEFAULT_MARGIN.y + trayBounds.height / 2);
            break;

        case 3: // for BOTTOM - LEFT
            x = Math.floor(trayBounds.x + DEFAULT_MARGIN.x + trayBounds.width / 2);
            y = Math.floor(
                trayBounds.y - height - DEFAULT_MARGIN.y + trayBounds.height / 2
            );
            break;

        case 4: // for BOTTOM - RIGHT
            x = Math.floor(
                trayBounds.x - width - DEFAULT_MARGIN.x + trayBounds.width / 2
            );
            y = Math.floor(
                trayBounds.y - height - DEFAULT_MARGIN.y + trayBounds.height / 2
            );
            break;
    }

    return { x: x, y: y };
}

module.exports = { init, getTray, setWindow, setWindowSize };