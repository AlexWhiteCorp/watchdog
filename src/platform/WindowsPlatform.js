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


    isWindowOpened() {
        if(this.window) {
            return this.window.isFocused()
        }

        return false
    }
}

export default WindowsPlatform