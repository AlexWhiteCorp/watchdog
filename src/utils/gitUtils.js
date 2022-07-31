import {GitOrganization} from "@/models/Git.model";

export const isNeedAttention = (organizations: GitOrganization[]) => {
    return organizations
        .filter(org => org.groups)
        .every(org => org.groups
            .flatMap(group => group.repositories)
            .flatMap(repo => repo.getPullRequests())
            .every(pr => pr.isApproved() || pr.isViewedByUser(org.user.username))
        )
}