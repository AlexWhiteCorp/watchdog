import {dateFormatted} from "@/utils";

export class GHUser {

    login;

    static of(json) {
        const instance = new GHUser()
        instance.login = json.login

        return instance
    }

}

export class GHRepo {

    html_url;
    full_name;
    updated_at;
    pullRequests = [];

    notFound = false

    getOwner() {
        return this.full_name.split('/')[0];
    }

    getName() {
        return this.full_name.split('/')[1];
    }

    static of(json) {
        const instance = new GHRepo()
        instance.html_url = json.html_url
        instance.full_name = json.full_name
        instance.updated_at = json.updated_at

        return instance
    }
}

export class GHPullRequest {

    number;
    html_url;
    title;
    draft;
    user;
    updated_at;
    review_comments;

    reviewers = []
    requested_reviewers = [];

    isOwner(login) {
        return this.user.login === login
    }

    isReviewer(login) {
        const isRequested = this.requested_reviewers
            .filter(reviewer => reviewer.login === login)
            .length !== 0

        if (isRequested) {
            return true;
        }

        const isReviewed = this.reviewers
            .filter(review => review.user.login === login)
            .length !== 0

        return isReviewed;
    }

    isApproved() {
        return this.reviewers
            .filter(review => review.state === 'APPROVED')
            .length !== 0
    }

    isApprovedByUser(login) {
        return this.reviewers
            .filter(review => review.state === GHReview.APPROVED && review.user.login === login)
            .length !== 0
    }

    isViewedByUser(prAuthor, localUser) {
        if(prAuthor === localUser) {
            return false
        }

        const authorComments = this.getAuthorCommentsCount(prAuthor)
        const localUserComments = this.getAuthorCommentsCount(localUser)

        return localUserComments !== 0 && authorComments < localUserComments
    }

    getApprovesCount() {
        return new Set(
            this.reviewers
                .filter(review => review.state === GHReview.APPROVED)
                .map(review => review.user.login)
        ).size
    }

    getReviewersCommentsCount(authorLogin) {
        return this.review_comments - this.getAuthorCommentsCount(authorLogin)
    }

    getAuthorCommentsCount(authorLogin) {
        return this.reviewers
            .filter(review => review.state === GHReview.COMMENTED && review.user.login === authorLogin)
            .length
    }

    getLastUpdate() {
        return dateFormatted(this.updated_at)
    }

    static of(json) {
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

export class GHReview {

    static APPROVED = "APPROVED";
    static COMMENTED = "COMMENTED";

    user;
    state;
    body;

    static of(json) {
        const instance = Object.setPrototypeOf(json, GHReview.prototype)
        instance.user = GHUser.of(json.user)

        return instance;
    }

}
