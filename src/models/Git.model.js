/* eslint-disable no-unused-vars */

export class GitOrganization {

    organization: string
    user: GitUser
    url: string
    groups: RepositoriesGroup[]
    credsError: boolean = false

    constructor(organization: string,
                user: GitUser,
                url: string,
                groups: RepositoriesGroup[],
                credsError: boolean = false) {
        this.organization = organization;
        this.user = user;
        this.url = url;
        this.groups = groups;
        this.credsError = credsError;
    }

    getUrl() {
        return `${this.url}/${this.organization}`
    }
}

export class RepositoriesGroup {

    repositories: GitRepository[]

    constructor(repositories: GitRepository[]) {
        this.repositories = repositories;
    }
}

export class GitUser {

    getUsername(): string {}

}

export class GitRepository {

    notFound: boolean = false

    isNotFound(): boolean {
        return this.notFound
    }

    getOwner(): string {}
    getName(): string {}
    getUrl(): string {}
    getPullRequests(): GitPullRequest[] {}
}

export class GitPullRequest {

    isOwner(login): boolean {
        return this.getAuthor().getUsername() === login
    }

    isReviewer(login): boolean {
        const isRequested = this.getRequestedReviewers()
            .filter(reviewer => reviewer.getUsername() === login)
            .length !== 0

        if (isRequested) {
            return true;
        }

        const isReviewed = this.getReviews()
            .filter(review => review.getAuthor().getUsername() === login)
            .length !== 0

        return isReviewed;
    }

    isViewedByUser(localUser): boolean {}

    isApproved(): boolean {}
    isApprovedByUser(login): boolean {}
    getApprovesCount(): number {}
    getReviewersCommentsCount(authorLogin): number {}
    getAuthorCommentsCount(authorLogin): number {}

    getId() {}
    getTitle() {}
    getUrl() {}
    getLastUpdate() {}
    getAuthor() {}
    getRequestedReviewers(): GitUser[] {}
    getReviews(): GitReview[] {}
}

export class GitReview {

    getAuthor(): GitUser {}
    isApproveReview(): boolean {}
    isComment(): boolean {}

}