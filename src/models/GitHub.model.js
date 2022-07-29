import {GitComment, GitDiscussion, GitPullRequest, GitRepository, GitReview, GitUser} from "@/models/Git.model";

export class GHUser extends GitUser{

    login: string;

    constructor(login: string) {
        super();
        this.login = login;
    }

    getUsername(): string {
        return this.login
    }

}

export class GHRepo extends GitRepository{

    name: string;
    url: string
    owner: GHUser;
    pullRequests: GHPullRequest[] = [];

    getName(): string {
        return this.name
    }
    
    getUrl(): string {
        return this.url
    }

    getAuthor(): GHUser {
        return this.owner
    }

    getPullRequests(): GitPullRequest[] {
        return this.pullRequests
    }
}

export class GHPullRequest extends GitPullRequest{

    number: string;
    title: string;
    url: string;
    isDraft: boolean;
    updatedAt: string;

    author: GHUser;
    reviews: GHReview[] = []
    reviewRequests: GHUser[] = [];
    reviewThreads: GHDiscussion[] = [];

    isApproved(): boolean {
        return this.reviews
            .filter(review => review.isApproveReview())
            .length !== 0
    }

    isApprovedByUser(login): boolean {
        return this.reviews
            .filter(review => review.isApproveReview() && review.getAuthor().getUsername() === login)
            .length !== 0
    }

    getApprovesCount(): number {
        return new Set(
            this.reviews
                .filter(review => review.isApproveReview())
                .map(review => review.getAuthor().getUsername())
        ).size
    }

    getId() {
        return this.number
    }

    getTitle() {
        return this.title
    }

    getUrl() {
        return this.url
    }

    getAuthor() {
        return this.author
    }

    getLastUpdate() {
        return this.updatedAt
    }

    getRequestedReviewers(): GHUser[] {
        return this.reviewRequests
    }

    getReviews(): GitReview[] {
        return this.reviews
    }

    getDiscussions(): GitDiscussion[] {
        return this.reviewThreads
    }
}

export class GHReview extends GitReview {

    static APPROVED = "APPROVED";

    state: string;
    author: GHUser;
    
    getAuthor(): GitUser {
        return this.author
    }

    isApproveReview() {
        return this.state === GHReview.APPROVED
    }
}

export class GHDiscussion extends GitDiscussion {

    isResolved: boolean
    comments: GHComment[]

    isThreadResolved(): boolean {
        return this.isResolved
    }

    getLastCommentAuthor(): GHUser {
        return this.comments[this.comments.length - 1].getAuthor()
    }
}

export class GHComment extends GitComment {

    author: GHUser

    getAuthor(): GitUser {
        return this.author
    }
}
