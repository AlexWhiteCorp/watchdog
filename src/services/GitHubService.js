import GitHubClient from "@/clients/GitHubClient";

class GitHubService {

    prFilters = []
    authUser

    constructor(authToken) {
        this.client = new GitHubClient(authToken);
    }

    addPRFilter(filter) {
        this.prFilters.push(filter);
    }

    filterPR(pr) {
        for (const prFilter of this.prFilters) {
            if(!prFilter(pr)) {
                return false;
            }
        }

        return true;
    }

    getSelfUser() {
        return this.client.getSelfUser()
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
                    prs.map(pr => this.#fetchPR(repo, pr))
                )
                repo.pullRequests = repo.pullRequests.filter(pr => this.filterPR(pr))
                return repo
            })
    }

    #fetchPR(repo, pr) {
        return this.client.getPullRequest(repo.getOwner(), repo.getName(), pr.number)
            .then(pr => {
                return this.client.getPullRequestReviews(repo.getOwner(), repo.getName(), pr.number)
                    .then(reviewers => {
                        pr.reviewers = reviewers
                        return pr
                    })
            })
    }
}

export default GitHubService