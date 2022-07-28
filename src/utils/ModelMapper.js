import {GLDiscussion, GLMergeRequest, GLProject, GLUser} from "@/models/GitLab.model";

const schema = {
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
            .flatMap(discus => discus.node.notes.edges)
            .map(comment => map(comment.node, GLDiscussion))
            .filter(discus => !discus.system)
        return obj
    },
    [GLDiscussion.name]: (json, obj: GLDiscussion) => {
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