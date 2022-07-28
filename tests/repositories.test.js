import GitLabService from "@/services/GitLabService";
import {isAllApproved} from "@/utils/gitUtils";
import {GitUser} from "@/models/Git.model";

const ORG_INFO_TEMPLATE = {
    organization: 'AlexWhiteCorp',
    groups: [
        {
            repositories: [
                'project-1'
            ]
        }
    ]
}

const PRESET = [
    {
        service: 'GitLab',
        serviceClass: GitLabService,
        author: 'AlexWhiteCorp',
        tests: [
            {
                errorFromClient: true,
                description: 'Project not found or Bad Request/Network Error',
                orgInfo: ORG_INFO_TEMPLATE,
                expected: {
                    getOrgUrl: 'https://gitlab.com/AlexWhiteCorp',

                    getOwner: 'AlexWhiteCorp',
                    getName: 'project-1',
                    getPullRequests: 0,
                    isNotFound: true,

                    isAllApproved: true
                }
            },
            {
                description: 'Project contains Local user Merge Request(new)',
                mockJson: 'AuthorUserNewMR',
                orgInfo: ORG_INFO_TEMPLATE,
                expected: {
                    getOrgUrl: 'https://gitlab.com/AlexWhiteCorp',

                    getOwner: 'AlexWhiteCorp',
                    getName: 'project-1',
                    getRepoUrl: 'https://gitlab.com/AlexWhiteCorp/project-1',
                    getPullRequests: 1,
                    isNotFound: false,

                    isOwner: true,
                    isReviewer: false,
                    isViewedByUser: false,
                    isApproved: false,
                    isApprovedByUser: false,
                    getApprovesCount: 0,
                    getReviewersCommentsCount: 0,
                    getAuthorCommentsCount: 0,
                    isAllApproved: false,
                    getPRUrl: 'https://gitlab.com/AlexWhiteCorp/project-1/-/merge_requests/1',
                    getPRId: 1,
                    getPRTitle: 'Merge Request 1 Title',
                    getPRLastUpdate: '2:11: 7.24.2022',
                }
            },
            {
                description: 'Project contains Another user Merge Request(reviewed without approve)',
                mockJson: 'AnotherUserReviewedMR',
                orgInfo: {
                    ...ORG_INFO_TEMPLATE,
                    organization: 'NotAlexWhiteCorp-1'
                },
                expected: {
                    getOrgUrl: 'https://gitlab.com/NotAlexWhiteCorp-1',

                    getOwner: 'NotAlexWhiteCorp-1',
                    getName: 'project-2',
                    getRepoUrl: 'https://gitlab.com/NotAlexWhiteCorp-1/project-2',
                    getPullRequests: 1,
                    isNotFound: false,

                    isOwner: false,
                    isReviewer: true,
                    isViewedByUser: true,
                    isApproved: false,
                    isApprovedByUser: false,
                    getApprovesCount: 0,
                    getReviewersCommentsCount: 3,
                    getAuthorCommentsCount: 0,
                    isAllApproved: true,
                    getPRUrl: 'https://gitlab.com/NotAlexWhiteCorp-1/project-2/-/merge_requests/2',
                    getPRId: 2,
                    getPRTitle: 'Merge Request 2 Title',
                    getPRLastUpdate: '2:11: 7.24.2022',
                }
            },
            {
                description: 'Project contains Another user Merge Request(approved)',
                mockJson: 'AnotherUserApprovedMR',
                orgInfo: {
                    ...ORG_INFO_TEMPLATE,
                    organization: 'NotAlexWhiteCorp-1'
                },
                expected: {
                    getOrgUrl: 'https://gitlab.com/NotAlexWhiteCorp-1',

                    getOwner: 'NotAlexWhiteCorp-1',
                    getName: 'project-2',
                    getRepoUrl: 'https://gitlab.com/NotAlexWhiteCorp-1/project-2',
                    getPullRequests: 1,
                    isNotFound: false,

                    isOwner: false,
                    isReviewer: true,
                    isViewedByUser: true,
                    isApproved: true,
                    isApprovedByUser: true,
                    getApprovesCount: 2,
                    getReviewersCommentsCount: 2,
                    getAuthorCommentsCount: 1,
                    isAllApproved: true,
                    getPRUrl: 'https://gitlab.com/NotAlexWhiteCorp-1/project-2/-/merge_requests/2',
                    getPRId: 2,
                    getPRTitle: 'Merge Request 2 Title',
                    getPRLastUpdate: '2:11: 7.24.2022',
                }
            }
        ]
    }
]

describe(`Check logic between API client and displaying data on UI (repositories)`, () => {
    for (const preset of PRESET) {
        describe(`Check implementation for ${preset.service}`, () => {
            for (const test of preset.tests) {
                describe(test.description, () => {
                    let org, repository, pullRequest

                    beforeAll(async () => {
                        const service = new preset.serviceClass()
                        service.authUser = new GitUser()
                        service.authUser.username = preset.author

                        if(!test.errorFromClient) {
                            const clientResponseMock = require(`./__mocks__/${preset.service}/${test.mockJson}.json`)
                            service.client.api.post = () => Promise.resolve({
                                data: clientResponseMock
                            })
                        } else {
                            service.client.api.post = () => Promise.reject(new Error())
                        }

                        org = await service.getOrganization(test.orgInfo)
                        repository = org.groups[0].repositories[0]
                        pullRequest = repository.getPullRequests()[0]
                    })

                    it('Organization model should contains web url', async () => {
                        expect(org.getUrl()).toBe(test.expected.getOrgUrl)
                    })
                    it('Repository model should contains owner login', () => {
                        expect(repository.getOwner()).toBe(test.expected.getOwner)
                    })
                    it('Repository model should contains it\'s name', () => {
                        expect(repository.getName()).toBe(test.expected.getName)
                    })
                    it('Repository model should contains it\'s author', () => {
                        expect(repository.getAuthor() === undefined).toBe(!!test.errorFromClient)
                    })
                    it('Repository model should contains \'notFound\' option enabled if error appeared during fetching data from API', () => {
                        expect(repository.isNotFound()).toBe(test.expected.isNotFound)
                    })
                    it('Repository model should contains web url(or undefined if repo is not found)', () => {
                        expect(repository.getUrl()).toBe(test.expected.getRepoUrl)
                    })
                    it('Repository model should contains list of Pull Requests', () => {
                        expect(repository.getPullRequests().length).toBe(test.expected.getPullRequests)
                    })

                    if(!test.errorFromClient) {
                        it('Check PullRequest::isOwner returns expected', () => {
                            expect(pullRequest.isOwner(preset.author)).toBe(test.expected.isOwner)
                        })
                        it('Check PullRequest::isReviewer returns expected', () => {
                            expect(pullRequest.isReviewer(preset.author)).toBe(test.expected.isReviewer)
                        })
                        it('Check PullRequest::isViewedByUser should return true if PR contains review comments without PR\'s author answer', () => {
                            expect(pullRequest.isViewedByUser(preset.author)).toBe(test.expected.isViewedByUser)
                        })
                        it('Check PullRequest::isApproved should return true if PR is approved by at least one user', () => {
                            expect(pullRequest.isApproved()).toBe(test.expected.isApproved)
                        })
                        it('Check PullRequest::isApprovedByUser should return true if PR is approved by user', () => {
                            expect(pullRequest.isApprovedByUser(preset.author)).toBe(test.expected.isApprovedByUser)
                        })
                        it('Check PullRequest::getApprovesCount should return total approves count', () => {
                            expect(pullRequest.getApprovesCount()).toBe(test.expected.getApprovesCount)
                        })
                        it('Check PullRequest::getAuthorCommentsCount should return only this user comments count', () => {
                            expect(pullRequest.getAuthorCommentsCount(pullRequest.getAuthor().getUsername())).toBe(test.expected.getAuthorCommentsCount)
                        })
                        it('Check PullRequest::getReviewersCommentsCount should return all users comments count excluding PR author comments', () => {
                            expect(pullRequest.getReviewersCommentsCount()).toBe(test.expected.getReviewersCommentsCount)
                        })
                        it('PullRequest model should contains web url', () => {
                            expect(pullRequest.getUrl()).toBe(test.expected.getPRUrl)
                        })
                        it('PullRequest model should contains id', () => {
                            expect(pullRequest.getId()).toBe(test.expected.getPRId)
                        })
                        it('PullRequest model should contains title', () => {
                            expect(pullRequest.getTitle()).toBe(test.expected.getPRTitle)
                        })
                        it('PullRequest model should contains lastUpdate', () => {
                            expect(pullRequest.getLastUpdate()).toBe(test.expected.getPRLastUpdate)
                        })
                    }

                    it('isAllApproved should return true if all PRs are approved or viewed by local user', () => {
                        expect(isAllApproved([org])).toBe(test.expected.isAllApproved)
                    })
                })
            }
        })
    }
})