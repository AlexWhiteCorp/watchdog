import GitService from "@/services/GitService";
import {GitOrganization, RepositoriesGroup} from "@/models/Git.model";
import {GitLabGroupConfig, GitLabOrganizationConfig} from "@/models/Config.model";
import GitLabClient from "@/clients/GitLabClient";
import {GLUser} from "@/models/GitLab.model";

    const GIT_LAB_API_URL = 'https://gitlab.com'

class GitLabService extends GitService {

    authUser: GLUser
    host: string

    constructor(authToken, host = GIT_LAB_API_URL) {
        super()
        this.host = host
        this.client = new GitLabClient(authToken, host)
    }

    getSelfUser(): GLUser {
        return this.client.getSelfUser()
    }

    async getOrganization(orgInfo: GitLabOrganizationConfig): GitOrganization {
        const groups = await Promise.all(
            orgInfo.groups.map(group => this.fetchGroup(orgInfo.organization, group))
        )

        return new GitOrganization(orgInfo.organization, this.authUser, this.host, groups)
    }

    async fetchGroup(organization: string, group: GitLabGroupConfig): RepositoriesGroup {
        let owner = group.subGroupName
            ? `${organization}/${group.subGroupName}`
            : organization

        const repositories = await Promise.all(
            group.projects.map(repo => this.client.getProject(`${owner}/${repo}`))
        )

        return new RepositoriesGroup(repositories)
    }
}

export default GitLabService