import GitHubClient from "@/clients/GitHubClient";
import GitService from "@/services/GitService";
import {GitOrganization, RepositoriesGroup} from "@/models/Git.model";
import {GHUser} from "@/models/GitHub.model";
import {GitHubGroupConfig, GitHubOrganizationConfig} from "@/models/Config.model";

const GIT_HUB_API_URL = 'https://api.github.com'
const GIT_HUB_URL = 'https://github.com'

class GitHubService extends GitService{

    authUser: GHUser

    constructor(authToken) {
        super()
        this.client = new GitHubClient(authToken, GIT_HUB_API_URL)
    }

    getSelfUser() {
        return this.client.getSelfUser()
    }

    async getOrganization(orgInfo: GitHubOrganizationConfig): GitOrganization {
        if(this.authUser) {
            const groups = await Promise.all(
                orgInfo.groups.map(group => this.fetchGroup(orgInfo.organization, group))
            )

            return new GitOrganization(orgInfo.organization, this.authUser, GIT_HUB_URL, groups)
        } else {
            return new GitOrganization(orgInfo.organization, null, null, [], true)
        }
    }

    async fetchGroup(organization: string, group: GitHubGroupConfig): RepositoriesGroup {
        const repositories = await Promise.all(
            group.repositories.map(repo => this.client.getRepository(organization, repo))
        )

        return new RepositoriesGroup(repositories)
    }
}

export default GitHubService