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
        if (this.authUser) {
            const repos = await Promise.all(
                orgInfo.groups.map(reposGroup =>
                    this.getRepos(orgInfo.organization, reposGroup)
                )
            )

            const groups = repos.map(repos => new RepositoriesGroup(repos))

            return new GitOrganization(orgInfo.organization, this.authUser, GIT_HUB_URL, groups)
        } else {
            return new GitOrganization(orgInfo.organization, null, null, [], true)
        }
    }

    async getRepos(organization:string, reposGroup: GitHubGroupConfig) {
        return Promise.all(
            reposGroup.repositories.map(repoName => this.#fetchRepo(organization, repoName, reposGroup.fetchPRs))
        )
    }

    #fetchRepo(organization, repoName, fetchPRs) {
        return this.client.getRepoByName(organization, repoName)
            .then(repo => {
                if(!repo.notFound && fetchPRs !== false) {
                    return this.#fetchPRs(repo)
                }

                return repo
            })
    }

    #fetchPRs(repo) {
        return this.client.getRepoPRs(repo.getOwner(), repo.getName())
            .then(async (prs) => {
                repo.pullRequests = await Promise.all(
                    prs
                        .filter(pr => pr.title.indexOf('Bump') === -1)
                        .map(pr => this.#fetchPR(repo, pr))
                )
                repo.pullRequests = repo.pullRequests
                    .filter(pr => !pr.draft)
                    .filter(pr => pr.isOwner(this.authUser.login) || pr.isReviewer(this.authUser.login))
                return repo
            })
    }

    #fetchPR(repo, pr) {
        return this.client.getPullRequest(repo.getOwner(), repo.getName(), pr.number)
            .then(pr => {
                if(pr.draft) {
                    return pr
                }

                return this.client.getPullRequestReviews(repo.getOwner(), repo.getName(), pr.number)
                    .then(reviewers => {
                        pr.reviewers = reviewers
                        return pr
                    })
            })
    }
}

export default GitHubService