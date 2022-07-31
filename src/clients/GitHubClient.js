import {GHRepo, GHUser} from "@/models/GitHub.model";
import ApiClient from "@/clients/ApiClient";
import {GITHUB_CURRENT_USER_QUERY, GITHUB_REPOSITORY_QUERY} from "@/clients/graphql.query";
import ModelMapper from "@/utils/ModelMapper";

const GRAPHQL_API_PATH = '/graphql'

class GitHubClient extends ApiClient {

    constructor(authToken: string, baseUrl: string) {
        super(GitHubClient, 'token ' + authToken, baseUrl);
    }

    getSelfUser():GHUser {
        const payload = {
            query: GITHUB_CURRENT_USER_QUERY
        }

        return this.api
            .post(GRAPHQL_API_PATH, payload)
            .then(response => ModelMapper.map(response.data.data.viewer, GHUser))
    }

    getRepository(owner: string, name: string):GHRepo {
        const payload = {
            query: GITHUB_REPOSITORY_QUERY,
            variables: {
                owner: owner,
                name: name
            }
        }

        return this.api
            .post(GRAPHQL_API_PATH, payload)
            .then(response => ModelMapper.map(response.data.data.repository, GHRepo))
            .catch((e) => {
                console.log(e)
                const repo = new GHRepo()
                repo.name = name
                repo.notFound = true
                return repo
            })
    }
}

export default GitHubClient;