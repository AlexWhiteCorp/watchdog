import {GLDiscussion, GLMergeRequest, GLProject, GLUser} from "@/models/GitLab.model";

const schema = {
    [GLProject.name]: (json, obj: GLProject) => {
        obj.mergeRequests = json.mergeRequests.edges.map(mr => map(mr.node, GLMergeRequest))
        return obj
    },
    [GLMergeRequest.name]: (json, obj: GLMergeRequest) => {
        obj.author = map(json.author, GLUser)
        obj.reviewers = json.reviewers.edges.map(reviewer => map(reviewer.node, GLUser))
        obj.approvedBy = json.approvedBy.edges.map(reviewer => map(reviewer.node, GLUser))
        obj.discussions = json.discussions.edges
            .map(discus => map(discus.node, GLDiscussion))
            .filter(discus => discus.resolvable)
        return obj
    },
    [GLDiscussion.name]: (json, obj: GLDiscussion) => {
        obj.author = json.notes.edges.map(note => map(note.node.author, GLUser))[0]
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