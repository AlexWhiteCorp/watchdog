export const GIT_HUB = "GitHub"
export const GIT_LAB = "GitLab"

export class OrganizationConfig {
    type: string = GIT_HUB
    accessToken: string
    organization: string
}

export class GroupConfig {}


export class GitHubOrganizationConfig extends OrganizationConfig {
    groups: GitHubGroupConfig[]
}

export class GitHubGroupConfig extends GroupConfig {
    repositories: string[]
}


export class GitLabOrganizationConfig extends OrganizationConfig {
    host: string
    groups: GitLabGroupConfig[]
}

export class GitLabGroupConfig extends GroupConfig {
    subGroupName: string
    projects: string[]
}