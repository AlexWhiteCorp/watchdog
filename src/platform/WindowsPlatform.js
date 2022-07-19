import PlatformSpecific from "@/platform/PlatformSpecific";

const margin = {
    x: -350,
    y: 20
}

class WindowsPlatform extends PlatformSpecific {
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
                this.window.show()
            }
        })
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