import {app} from "electron";

const margin = {
    x: -350,
    y: 0
}

class PlatformSpecific {

    setWindow(window) {
        this.window = window
    }

    hideWindow() {
        if(this.window) {
            this.window.hide()
        }
    }

    showWindow() {
        if(this.window) {
            this.window.show()
        }
    }

    resizeWindow(width, height) {
        if(this.window) {
            this.window.setSize(Math.round(width), Math.round(height))
        }
    }

    getMargin() {
        return margin
    }

    quitApp() {
        app.exit(0)
    }
}

export default PlatformSpecific