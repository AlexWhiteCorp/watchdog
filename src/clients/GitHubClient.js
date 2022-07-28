import {GHPullRequest, GHRepo, GHReview, GHUser} from "@/models/GitHub.model";
import ApiClient from "@/clients/ApiClient";
import {OrganizationConfig} from "@/models/Config.model";

class GitHubClient extends ApiClient {

    constructor(authToken: string, basePath: string) {
        super(GitHubClient, 'token ' + authToken, basePath);
    }

    getSelfUser() {
        return this.api.get(`/user`)
            .then(response => GHUser.of(response.data))
    }

    getRepoByName(organization: OrganizationConfig, repoName: string) {
        return this.api.get(`/repos/${organization}/${repoName}`)
            .then(response => GHRepo.of(response.data))
            .catch((e) => {
                console.log(e)
                const repo = new GHRepo()
                repo.full_name = organization + '/' + repoName
                repo.notFound = true
                return repo
            })
    }

    getRepoPRs(organization: OrganizationConfig, repoName: string) {
        return this.api.get(`/repos/${organization}/${repoName}/pulls`)
            .then(response => response.data.map(pr => GHPullRequest.of(pr)))
    }

    getPullRequest(organization: OrganizationConfig, repoName: string, prNumber: number) {
        return this.api.get(`/repos/${organization}/${repoName}/pulls/${prNumber}`)
            .then(response => GHPullRequest.of(response.data))
    }

    getPullRequestReviews(organization: OrganizationConfig, repoName: string, prNumber: number) {
        return this.api.get(`/repos/${organization}/${repoName}/pulls/${prNumber}/reviews`)
            .then(response => response.data.map(review => GHReview.of(review)))
    }
}

export default GitHubClient;