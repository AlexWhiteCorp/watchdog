import {getAppVersion, getOSId, isVersionOutdated} from "@/utils/utils";
import UpdatesClient from "@/clients/UpdatesClient";

const API_URL = 'https://alexwhitecorp.github.io/watchdog'

class UpdateService {

    constructor() {
        this.api = new UpdatesClient(API_URL)
    }

    checkUpdates() {
        return this.api
            .getLastVersions()
            .then(lastVersions => {
                const appVersion = getAppVersion()
                const lastVersion = lastVersions[getOSId()]
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