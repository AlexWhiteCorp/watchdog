import {GitComment, GitDiscussion, GitPullRequest, GitRepository, GitReview, GitUser} from "@/models/Git.model";

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

    getName(): string {
        const names = this.fullPath.split('/')
        return names[names.length - 1];
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

    getLastUpdate() {
        return this.updatedAt
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

    getDiscussions(): GLDiscussion[] {
        return this.discussions
    }
}

export class GLDiscussion extends GitDiscussion {

    resolved: boolean
    notes: GLComment[]

    isThreadResolved(): boolean {
        return this.resolved
    }

    getComments(): GitComment[] {
        return this.notes
    }

    getLastCommentAuthor(): GLUser {
        return this.notes[this.notes.length - 1].getAuthor()
    }
}

export class GLComment extends GitComment {

    system: boolean
    author: GLUser

    getAuthor(): GitUser {
        return this.author
    }
}