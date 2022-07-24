const packageJson = require('../../package.json')

const WIN64 = 'win64'
const MACOS_ARM = 'mac-arm'
const MACOS64 = 'mac64'

export const isWindows = () => process.platform === 'win32'

export const isMac = () => process.platform === 'darwin'

export const isArm = () => process.arch === 'arm64'

export const dateFormatted = (value) => {
    const date = new Date(value)
    const localTime = date.toLocaleTimeString().substring(0, 5)
    const localDate = date.toLocaleDateString().replaceAll('/', '.')

    return `${localTime} ${localDate}`
}

export const getOSId = () => {
    if(isWindows()) {
        return WIN64
    }

    if(isMac()) {
        if(isArm()) {
            return MACOS_ARM
        }

        return MACOS64
    }
}

export const getAppVersion = () => {
    return packageJson.version
}

export const isVersionOutdated = (curr, latest) => {
    const currVersion = curr.split('.')
    const latestVersion = latest.split('.')

    for(let i = 2; i >= 0; i--) {
        if(Number(currVersion[i]) < Number(latestVersion[i])) {
            return true
        }
    }

    return  false
}