import axios from "axios";
import {getAppVersion, getOSId, isVersionOutdated} from "@/utils";
import log from "electron-log"
import {showNotification} from "@/background";

const CHECK_DELAY = 60 * 60 * 1000

const api = axios.create({
    baseURL: 'https://alexwhitecorp.github.io/watchdog',
})

api.interceptors.request.use(
    (config) => {
        const method = config.method.toUpperCase()
        const path = config.url
        log.debug(`[${UpdateService.name}]: `, `${method} ${path}`)
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);

class UpdateService {

    constructor() {
        this.checkUpdates()
    }

    async checkUpdates() {
        const {data} = await api.get('/versions.json')

        const appVersion = getAppVersion()
        const lastVersion = data[getOSId()]
        if (!lastVersion) {
            log.info(`[${UpdateService.name}]: `, 'Can\'t determine last actual version')
            return
        }

        if (isVersionOutdated(appVersion, lastVersion.version)) {
            showNotification('', 'New version available')
        } else {
            setTimeout(() => {
                this.checkUpdates()
            }, CHECK_DELAY)
        }
    }
}

export default UpdateService