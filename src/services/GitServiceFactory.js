import {OrganizationConfig} from "@/models/Config.model";
import GitHubService from "@/services/GitHubService";
import GitLabService from "@/services/GitLabService";
import GitService from "@/services/GitService";

const GIT_HUB = 'GitHub'
const GIT_LAB = 'GitLab'

const instances = {
    [GIT_HUB]: {},
    [GIT_LAB]: {},
}

class GitServiceFactory {

    static async getInstance(orgInfo: OrganizationConfig): GitService {
        let gitService = instances[orgInfo.type][orgInfo.organization]
        if (gitService === undefined) {
            gitService = this.#newInstance(orgInfo.type, orgInfo.host, orgInfo.accessToken)
            instances[orgInfo.type][orgInfo.organization] = gitService

            try {
                gitService.authUser = await gitService.getSelfUser()
            } catch (e) {
                gitService.authUser = null
            }

        }

        return gitService
    }

    static #newInstance(type: string,
                        host: string,
                        accessToken: string) {
        switch (type) {
            case GIT_LAB:
                return new GitLabService(accessToken, host)

            case GIT_HUB:
            default:
                return new GitHubService(accessToken)
        }
    }
}

export default GitServiceFactory