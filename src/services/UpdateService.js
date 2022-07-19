import axios from "axios";
import {getAppVersion, getOSId, isVersionOutdated} from "@/utils";

const api = axios.create({
    baseURL: 'https://alexwhitecorp.github.io/watchdog',
})

api.interceptors.request.use(
    (config) => {
        const method = config.method.toUpperCase()
        const path = config.url
        window.logger.debug(`[${UpdateService.name}]: `, `${method} ${path}`)
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);

class UpdateService {

    checkUpdates() {
        return api.get('/versions.json')
            .then(response => {
                const appVersion = getAppVersion()
                const lastVersion = response.data[getOSId()]
                if (!lastVersion) {
                    window.logger.info(`[${UpdateService.name}]: `, 'Can\'t determine last actual version')
                    return false
                }

                return isVersionOutdated(appVersion, lastVersion.version)
            })
    }
}

const instance = new UpdateService()

export default instance