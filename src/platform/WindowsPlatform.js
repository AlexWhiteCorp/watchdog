import PlatformSpecific from "@/platform/PlatformSpecific";

const margin = {
    x: -350,
    y: 35
}

class WindowsPlatform extends PlatformSpecific {

    getMargin() {
        return margin
    }
}

export default WindowsPlatform