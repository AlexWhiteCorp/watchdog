import PlatformSpecific from "@/platform/PlatformSpecific";
import {app} from "electron";

class MacOSPlatform extends PlatformSpecific {

    constructor() {
        super();
        app.dock.hide()
    }

    hideWindow() {
        super.hideWindow()
        if (this.window) {
            app.hide()
        }
    }

    onBlurWindow() {
        if(this.window) {
            this.hideWindow()
        }
    }

    onTrayClick() {
        if(this.window) {
            this.window.blur()
        }
    }
}

export default MacOSPlatform