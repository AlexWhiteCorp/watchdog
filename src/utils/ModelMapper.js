import {GLComment, GLDiscussion, GLMergeRequest, GLProject, GLUser} from "@/models/GitLab.model";
import {GHComment, GHDiscussion, GHPullRequest, GHRepo, GHReview, GHUser} from "@/models/GitHub.model";

const schema = {
    [GHRepo.name]: (json, obj: GHRepo) => {
        obj.pullRequests = json.pullRequests.edges
            .map(pr => map(pr.node, GHPullRequest))
            .filter(pr => !pr.isDraft)
        obj.owner = map(json.owner, GHUser)
        return obj
    },
    [GHPullRequest.name]: (json, obj: GHPullRequest) => {
        obj.author = map(json.author, GHUser)
        obj.reviews = json.reviews.edges.map(review => map(review.node, GHReview))
        obj.reviewRequests = json.reviewRequests.edges.map(reviewRequest => map(reviewRequest.node.requestedReviewer, GHUser))
        obj.reviewThreads = json.reviewThreads.edges.map(thread => map(thread.node, GHDiscussion))
        return obj
    },
    [GHReview.name]: (json, obj: GHReview) => {
        obj.author = map(json.author, GHUser)
        return obj
    },
    [GHDiscussion.name]: (json, obj: GHDiscussion) => {
        obj.comments = json.comments.edges.map(comment => map(comment.node, GHComment))
        return obj
    },
    [GHComment.name]: (json, obj: GHComment) => {
        obj.author = map(json.author, GHUser)
        return obj
    },

    [GLProject.name]: (json, obj: GLProject) => {
        obj.mergeRequests = json.mergeRequests.edges.map(mr => map(mr.node, GLMergeRequest))
        obj.author = map(json.author, GLUser)
        return obj
    },
    [GLMergeRequest.name]: (json, obj: GLMergeRequest) => {
        obj.author = map(json.author, GLUser)
        obj.reviewers = json.reviewers.edges.map(reviewer => map(reviewer.node, GLUser))
        obj.approvedBy = json.approvedBy.edges.map(reviewer => map(reviewer.node, GLUser))
        obj.discussions = json.discussions.edges
            .map(discus => map(discus.node, GLDiscussion))
            .filter(discus => discus.getComments().length)
        return obj
    },
    [GLDiscussion.name]: (json, obj: GLDiscussion) => {
        obj.notes = json.notes.edges
            .map(note => map(note.node, GLComment))
            .filter(comment => !comment.system)
        return obj
    },
    [GLComment.name]: (json, obj: GLDiscussion) => {
        obj.author = map(json.author, GLUser)
        return obj
    }
}

function map(json, targetClass) {
    const obj = new targetClass()
    for(const key in json) {
        obj[key] = json[key]
    }

    if(schema[targetClass.name]) {
        schema[targetClass.name](json, obj)
    }

    return obj
}

export default {map}