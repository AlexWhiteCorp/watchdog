import {GitPullRequest, GitRepository, GitReview, GitUser} from "@/models/Git.model";
import {dateFormatted} from "@/utils/utils";

export class GLUser extends GitUser {

    username: string

    getUsername(): string {
        return this.username
    }

}

export class GLProject extends GitRepository {

    fullPath: string
    webUrl: string
    author: GLUser
    mergeRequests: GLMergeRequest[] = []
    notFound: boolean = false

    getOwner(): string {
        return this.fullPath.split('/')[0];
    }

    getName(): string {
        const names = this.fullPath.split('/')
        return names[names.length - 1];
    }

    getTitle() {
        return this.title
    }

    getUrl() {
        return this.webUrl
    }

    getAuthor() {
        return this.author
    }

    getPullRequests(): GitPullRequest[] {
        return this.mergeRequests
    }

    isNotFound(): boolean {
        return this.notFound
    }
}

export class GLMergeRequest extends GitPullRequest{

    iid: number
    title: string
    webUrl: string
    updatedAt: string
    author: GitUser
    reviewers: GitUser[] = []
    approvedBy: GitUser[] = []
    discussions: GLDiscussion[] = []

    isApproved(): boolean {
        return this.approvedBy.length !== 0
    }

    isApprovedByUser(login): boolean {
        return this.approvedBy
            .filter(user => user.getUsername() === login)
            .length !== 0
    }

    getApprovesCount(): number {
        return this.approvedBy.length
    }

    getReviewersCommentsCount(authorLogin): number {
        return this.discussions.length - this.getAuthorCommentsCount(authorLogin)
    }

    getAuthorCommentsCount(authorLogin): number {
        return this.discussions
            .filter(discus => discus.author.getUsername() === authorLogin)
            .length
    }

    getLastUpdate() {
        return dateFormatted(this.updatedAt)
    }

    getId() {
        return this.iid
    }

    getTitle() {
        return this.title
    }

    getUrl() {
        return this.webUrl
    }

    getAuthor() {
       return this.author
    }

    getRequestedReviewers(): GitUser[] {
        return this.reviewers
    }

    getReviews(): GitReview[] {
        return this.discussions
    }
}

export class GLDiscussion extends GitReview {
    resolved
    author: GLUser
}