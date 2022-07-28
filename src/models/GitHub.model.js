import {GitPullRequest, GitRepository, GitReview, GitUser} from "@/models/Git.model";

export class GHUser extends GitUser{

    login: string;

    getUsername(): string {
        return this.login
    }

    static of(json): GHUser {
        const instance = new GHUser()
        instance.login = json.login

        return instance
    }

}

export class GHRepo extends GitRepository{

    html_url: string;
    full_name: string;
    updated_at: string;
    pullRequests: GHPullRequest[] = [];

    getOwner(): string {
        return this.full_name.split('/')[0];
    }

    getName(): string {
        return this.full_name.split('/')[1];
    }


    getUrl(): string {
        return this.html_url
    }

    getPullRequests(): GitPullRequest[] {
        return this.pullRequests
    }

    static of(json): GHRepo {
        const instance = new GHRepo()
        instance.html_url = json.html_url
        instance.full_name = json.full_name
        instance.updated_at = json.updated_at

        return instance
    }
}

export class GHPullRequest extends GitPullRequest{

    number: string;
    html_url: string;
    title: string;
    draft: boolean;
    user: GHUser;
    updated_at: string;
    review_comments: number;

    reviewers: GHReview[] = []
    requested_reviewers: GHUser[] = [];

    isApproved(): boolean {
        return this.reviewers
            .filter(review => review.isApproveReview())
            .length !== 0
    }

    isApprovedByUser(login): boolean {
        return this.reviewers
            .filter(review => review.isApproveReview() && review.getAuthor().getUsername() === login)
            .length !== 0
    }

    isViewedByUser(localUser): boolean {
        const prAuthor = this.getAuthor().getUsername()
        if (prAuthor === localUser) {
            return false
        }

        const authorComments = this.getAuthorCommentsCount(prAuthor)
        const localUserComments = this.getAuthorCommentsCount(localUser)

        return localUserComments !== 0 && authorComments < localUserComments
    }

    getApprovesCount(): number {
        return new Set(
            this.reviewers
                .filter(review => review.isApproveReview())
                .map(review => review.getAuthor().getUsername())
        ).size
    }

    getLastUpdate() {
        return this.updated_at
    }

    getReviewersCommentsCount(authorLogin): number {
        return this.review_comments - this.getAuthorCommentsCount(authorLogin)
    }

    getAuthorCommentsCount(authorLogin): number {
        return this.reviewers
            .filter(review => review.isComment() && review.getAuthor().getUsername() === authorLogin)
            .length
    }

    getId() {
        return this.number
    }

    getTitle() {
        return this.title
    }

    getUrl() {
        return this.html_url
    }

    getAuthor() {
        return this.user
    }

    getRequestedReviewers(): GHUser[] {
        return this.requested_reviewers
    }

    getReviews(): GitReview[] {
        return this.reviewers
    }

    static of(json): GHPullRequest {
        const instance = new GHPullRequest()
        instance.number = json.number
        instance.html_url = json.html_url
        instance.title = json.title
        instance.draft = json.draft
        instance.updated_at = json.updated_at
        instance.review_comments = json.review_comments

        instance.user = GHUser.of(json.user)
        instance.requested_reviewers = json.requested_reviewers.map(r => GHUser.of(r))

        return instance;
    }
}

export class GHReview extends GitReview {

    static APPROVED = "APPROVED";
    static COMMENTED = "COMMENTED";

    user: GHUser;
    state: string;
    body: string;

    static of(json): GHReview {
        const instance = Object.setPrototypeOf(json, GHReview.prototype)
        instance.user = GHUser.of(json.user)

        return instance;
    }

    getAuthor(): GitUser {
        return this.user
    }

    isApproveReview() {
        return this.state === GHReview.APPROVED
    }

    isComment() {
        return this.state === GHReview.COMMENTED
    }
}
