import axios from "axios";
import {GHPullRequest, GHRepo, GHReview, GHUser} from "@/models/GitHubModels";

const GIT_HUB_API_URL = 'https://api.github.com'

class GitHubClient {
    constructor(authToken) {
        this.api = axios.create({
            baseURL: GIT_HUB_API_URL,
            headers: {
                'Authorization': 'token ' + authToken,
                'Content-Type': 'application/json'
            },
            timeout: 10000,
            adapter: require('axios/lib/adapters/http')
        })

        this.api.interceptors.request.use(
            (config) => {
                const method = config.method.toUpperCase()
                const path = config.url
                window.logger.debug(GitHubClient.name, `${method} ${path}`)
                return config;
        }, (error) => {
                return Promise.reject(error);
        });
    }

    getSelfUser() {
        return this.api.get(`/user`)
            .then(response => GHUser.of(response.data))
    }

    getRepoByName(organization, repoName) {
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

    getRepoPRs(organization, repoName) {
        return this.api.get(`/repos/${organization}/${repoName}/pulls`)
            .then(response => response.data.map(pr => GHPullRequest.of(pr)))
    }

    getPullRequest(organization, repoName, prNumber) {
        return this.api.get(`/repos/${organization}/${repoName}/pulls/${prNumber}`)
            .then(response => GHPullRequest.of(response.data))
    }

    getPullRequestReviews(organization, repoName, prNumber) {
        return this.api.get(`/repos/${organization}/${repoName}/pulls/${prNumber}/reviews`)
            .then(response => response.data.map(review => GHReview.of(review)))
    }
}

export default GitHubClient;