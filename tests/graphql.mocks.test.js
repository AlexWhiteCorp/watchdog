import {
    GITHUB_CURRENT_USER_QUERY,
    GITHUB_REPOSITORY_QUERY,
    GITLAB_CURRENT_USER_QUERY,
    GITLAB_PROJECT_QUERY
} from "@/clients/graphql.query";
import gql from "graphql-tag";

const PRESET = [
    {
        service: 'GitHub',
        queries: [
            {
                model: 'user',
                gql: GITHUB_CURRENT_USER_QUERY,
                mocks: [
                    'User'
                ]
            },
            {
                model: 'repository',
                gql: GITHUB_REPOSITORY_QUERY,
                mocks: [
                    'AuthorUserNewPR',
                    'AnotherUserReviewedPR',
                    'AnotherUserApprovedPR'
                ]
            }
        ]
    },
    {
        service: 'GitLab',
        queries: [
            {
                model: 'user',
                gql: GITLAB_CURRENT_USER_QUERY,
                mocks: [
                    'User'
                ]
            },
            {
                model: 'repository',
                gql: GITLAB_PROJECT_QUERY,
                mocks: [
                    'AuthorUserNewMR',
                    'AnotherUserReviewedMR',
                    'AnotherUserApprovedMR'
                ]
            }
        ]
    }
]

function test(node, field) {
    const selection = node[field.name.value]
    const defined = selection !== undefined

    it(`Should contains '${field.name.value}' field`, () => {
        expect(defined).toBeTruthy()
    });

    return selection
}

function checkSelectionProxy(selectionSet, json, parentName) {
    if(selectionSet.selections) {
        for (const selection of selectionSet.selections) {
            if(selection.name && selection.name.value === 'node') {
                json.forEach(el => checkSelection(selection, el, parentName, true))
            } else {
                checkSelection(selection, json, parentName, true)
            }
        }

        if(!Array.isArray(json)) {
            it(`Shouldn't contains another fields`, () => {
                expect(Object.keys(json).length > selectionSet.selections.length).not.toBeTruthy()
            })
        }
    }
    else {
        if(selectionSet.kind === 'InlineFragment') {
            checkSelection(selectionSet.selectionSet, json, parentName)
            return
        }

        const selectionSetNode = test(json, selectionSet)

        if(selectionSet.selectionSet && selectionSetNode !== undefined) {
            checkSelection(selectionSet.selectionSet, selectionSetNode, selectionSet.name.value)
        }
    }
}

function checkSelection(selectionSet, json, parentName, skip) {
    if(skip) {
        checkSelectionProxy(selectionSet, json, parentName)
    } else {
        describe(`Structure '${parentName}'`, () => {
            checkSelectionProxy(selectionSet, json, parentName)
        })
    }
}

describe('Compare client response mocks with graphql query', () => {
    for (const preset of PRESET) {
        describe(`${preset.service} API`, () => {
            for (const query of preset.queries) {
                describe(`Query '${query.model}'`, () => {
                    let selectionSet = gql`${query.gql}`.definitions[0].selectionSet.selections[0]

                    for (const mock of query.mocks) {
                        describe(`Mock '${mock}.json'`, () => {
                            const mockJson = require(`./__mocks__/${preset.service}/${mock}.json`).data

                            checkSelection(selectionSet, mockJson, 'query')
                        })
                    }
                })
            }
        })
    }
})