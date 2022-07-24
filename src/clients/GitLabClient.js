import ModelMapper from "@/utils/ModelMapper";
import {GLProject, GLUser} from "@/models/GitLab.model";
import {GITLAB_CURRENT_USER_QUERY, GITLAB_PROJECT_QUERY} from "@/clients/graphql.query";
import ApiClient from "@/clients/ApiClient";

const GRAPHQL_API_PATH = '/api/graphql'

class GitLabClient extends ApiClient {

    constructor(authToken: string, baseUrl: string) {
        super(GitLabClient, 'Bearer ' + authToken, baseUrl);
    }

    getSelfUser() {
        const payload = {
            query: GITLAB_CURRENT_USER_QUERY
        }

        return this.api
            .post(GRAPHQL_API_PATH, payload)
            .then(response => ModelMapper.map(response.data.data.currentUser, GLUser))
    }

    getProject(fullPath: string) {
        const payload = {
            query: GITLAB_PROJECT_QUERY,
            variables: {
                fullPath: fullPath
            }
        }

        return this.api
            .post(GRAPHQL_API_PATH, payload)
            .then(response => ModelMapper.map(response.data.data.project, GLProject))
            .catch((e) => {
                window.logger.error(GitLabClient.name, e.message)
                const repo = new GLProject()
                repo.fullPath = fullPath
                repo.notFound = true
                return repo
            })
    }
}

export default GitLabClient;