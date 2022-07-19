import GitHubClient from "@/clients/GitHubClient";

const instances = {}

class GitHubService {

    authUser

    constructor(authToken) {
        this.client = new GitHubClient(authToken);
    }

    getSelfUser() {
        return this.client.getSelfUser()
    }

    async getOrganization(orgInfo) {
        if (this.authUser) {
            const repos = await Promise.all(
                orgInfo.groups.map(reposGroup =>
                    this.getRepos(orgInfo.organization, reposGroup)
                )
            )

            return {
                organization: orgInfo.organization,
                user: this.authUser,
                repositories: repos,
                credsError: false
            }
        } else {
            return {
                organization: orgInfo.organization,
                credsError: true
            }
        }
    }

    async getRepos(organization, reposGroup) {
        window.log(`Fetching info about repositories: [${reposGroup.repositories}]`)
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

    static async getInstance(orgInfo) {
        let githubService = instances[orgInfo.organization]
        if (githubService === undefined) {
            githubService = new GitHubService(orgInfo.accessToken)

            try {
                githubService.authUser = await githubService.getSelfUser()
            } catch (e) {
                githubService.authUser = null
            }

            instances[orgInfo.organization] = githubService
        }

        return githubService
    }
}

export default GitHubService