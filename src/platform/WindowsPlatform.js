import PlatformSpecific from "@/platform/PlatformSpecific";
import {app} from "electron";

const margin = {
    x: -350,
    y: 20
}

class WindowsPlatform extends PlatformSpecific {

    constructor() {
        super();
        app.setAppUserModelId('WatchDog')
    }

    getMargin() {
        return margin
    }

    hideWindow() {
        if(this.window) {
            this.window.blur()
        }
    }

    showWindow() {
        setTimeout(() => {
            if(this.window) {
                const bounds = this.window.getBounds()
                this.window.setPosition(-33333, -33333, false)
                this.window.show()
                setTimeout(() => {
                    this.window.setBounds(bounds)
                }, 100)
            }
        }, 350)
    }


    onBlurWindow() {
        if(this.window) {
            this.window.hide()
            this.wasBlured = true
            setTimeout(() => {
                this.wasBlured = false
            }, 300)
        }
    }

    isWindowOpened() {
        if(this.window) {
            return this.window.isFocused() || this.wasBlured
        }

        return false
    }
}

export default WindowsPlatform