export class OrganizationConfig {
    type: string = "GitHub"
    host: string
    accessToken: string
    organization: string
    groups: GroupConfig[]
}

export class GroupConfig {
    subGroupName: string
    fetchPRs: boolean = true
    repositories: string[]
}