import GitLabService from "@/services/GitLabService";
import {isNeedAttention} from "@/utils/gitUtils";
import {GitUser} from "@/models/Git.model";
import GitHubService from "@/services/GitHubService";
import ModelMapper from "@/utils/ModelMapper";
import {GIT_LAB, OrganizationConfig} from "@/models/Config.model";

const GITHUB_ORG_INFO_TEMPLATE = {
    organization: 'AlexWhiteCorp',
    groups: [
        {
            repositories: [
                'repository-1'
            ]
        }
    ]
}

const GITLAB_ORG_INFO_TEMPLATE = {
    organization: 'AlexWhiteCorp',
    groups: [
        {
            projects: [
                'project-1'
            ]
        }
    ]
}

const PRESET = [
    {
        service: 'GitHub',
        serviceClass: GitHubService,
        author: 'AlexWhiteCorp',
        tests: [
            {
                errorFromClient: true,
                description: 'Repository not found or Bad Request/Network Error',
                orgInfo: GITHUB_ORG_INFO_TEMPLATE,
                expected: {
                    getOrgUrl: 'https://github.com/AlexWhiteCorp',

                    getName: 'repository-1',
                    getPullRequests: 0,
                    isNotFound: true,

                    isNeedAttention: true
                }
            },
            {
                description: 'Repository contains Local user Pull Request(new)',
                mockJson: 'AuthorUserNewPR',
                orgInfo: GITHUB_ORG_INFO_TEMPLATE,
                expected: {
                    getOrgUrl: 'https://github.com/AlexWhiteCorp',

                    getName: 'repository-1',
                    getRepoUrl: 'https://github.com/AlexWhiteCorp/repository-1',
                    getPullRequests: 1,
                    isNotFound: false,

                    isOwner: true,
                    isReviewer: false,
                    isViewedByUser: false,
                    isApproved: false,
                    isApprovedByUser: false,
                    getApprovesCount: 0,
                    getTotalDiscussionsCount: 0,
                    getActiveDiscussionsCount: 0,
                    isNeedAttention: false,
                    getPRUrl: 'https://github.com/AlexWhiteCorp/repository-1/pull/1',
                    getPRId: 1,
                    getPRTitle: 'Pull Request Title',
                    getPRLastUpdate: '2022-07-28T20:06:01Z',
                }
            },
            {
                description: 'Project contains Another user Pull Request(reviewed without approve)',
                mockJson: 'AnotherUserReviewedPR',
                orgInfo: {
                    ...GITHUB_ORG_INFO_TEMPLATE,
                    organization: 'NotAlexWhiteCorp-1'
                },
                expected: {
                    getOrgUrl: 'https://github.com/NotAlexWhiteCorp-1',

                    getName: 'repository-2',
                    getRepoUrl: 'https://github.com/NotAlexWhiteCorp-1/repository-2',
                    getPullRequests: 1,
                    isNotFound: false,

                    isOwner: false,
                    isReviewer: true,
                    isViewedByUser: true,
                    isApproved: false,
                    isApprovedByUser: false,
                    getApprovesCount: 0,
                    getTotalDiscussionsCount: 4,
                    getActiveDiscussionsCount: 2,
                    isNeedAttention: true,
                    getPRUrl: 'https://github.com/NotAlexWhiteCorp-1/repository-2/pull/1',
                    getPRId: 1,
                    getPRTitle: 'Pull Request Title',
                    getPRLastUpdate: '2022-07-28T20:06:01Z',
                }
            },
            {
                description: 'Project contains Another user Pull Request(approved)',
                mockJson: 'AnotherUserApprovedPR',
                orgInfo: {
                    ...GITHUB_ORG_INFO_TEMPLATE,
                    organization: 'NotAlexWhiteCorp-1'
                },
                expected: {
                    getOrgUrl: 'https://github.com/NotAlexWhiteCorp-1',

                    getName: 'repository-2',
                    getRepoUrl: 'https://github.com/NotAlexWhiteCorp-1/repository-2',
                    getPullRequests: 1,
                    isNotFound: false,

                    isOwner: false,
                    isReviewer: true,
                    isViewedByUser: false,
                    isApproved: true,
                    isApprovedByUser: true,
                    getApprovesCount: 1,
                    getTotalDiscussionsCount: 1,
                    getActiveDiscussionsCount: 0,
                    isNeedAttention: true,
                    getPRUrl: 'https://github.com/NotAlexWhiteCorp-1/repository-2/pull/1',
                    getPRId: 1,
                    getPRTitle: 'Pull Request Title',
                    getPRLastUpdate: '2022-07-28T20:06:01Z',
                }
            }
        ]
    },
    {
        service: 'GitLab',
        serviceClass: GitLabService,
        author: 'AlexWhiteCorp',
        tests: [
            {
                errorFromClient: true,
                description: 'Project not found or Bad Request/Network Error',
                orgInfo: {
                    ...GITLAB_ORG_INFO_TEMPLATE,
                    type: GIT_LAB
                },
                expected: {
                    getOrgUrl: 'https://gitlab.com/AlexWhiteCorp',

                    getName: 'project-1',
                    getPullRequests: 0,
                    isNotFound: true,

                    isNeedAttention: true
                }
            },
            {
                description: 'Project contains Local user Merge Request(new)',
                mockJson: 'AuthorUserNewMR',
                orgInfo: {
                    ...GITLAB_ORG_INFO_TEMPLATE,
                    type: GIT_LAB
                },
                expected: {
                    getOrgUrl: 'https://gitlab.com/AlexWhiteCorp',

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
                    getTotalDiscussionsCount: 0,
                    getActiveDiscussionsCount: 0,
                    isNeedAttention: false,
                    getPRUrl: 'https://gitlab.com/AlexWhiteCorp/project-1/-/merge_requests/1',
                    getPRId: 1,
                    getPRTitle: 'Merge Request 1 Title',
                    getPRLastUpdate: '2022-07-24T11:11:49Z',
                }
            },
            {
                description: 'Project contains Another user Merge Request(reviewed without approve)',
                mockJson: 'AnotherUserReviewedMR',
                orgInfo: {
                    ...GITLAB_ORG_INFO_TEMPLATE,
                    type: GIT_LAB,
                    organization: 'NotAlexWhiteCorp-1'
                },
                expected: {
                    getOrgUrl: 'https://gitlab.com/NotAlexWhiteCorp-1',

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
                    getTotalDiscussionsCount: 4,
                    getActiveDiscussionsCount: 2,
                    getPRUrl: 'https://gitlab.com/NotAlexWhiteCorp-1/project-2/-/merge_requests/2',
                    getPRId: 2,
                    getPRTitle: 'Merge Request 2 Title',
                    getPRLastUpdate: '2022-07-24T11:11:49Z',
                    isNeedAttention: true,
                }
            },
            {
                description: 'Project contains Another user Merge Request(approved)',
                mockJson: 'AnotherUserApprovedMR',
                orgInfo: {
                    ...GITLAB_ORG_INFO_TEMPLATE,
                    type: GIT_LAB,
                    organization: 'NotAlexWhiteCorp-1'
                },
                expected: {
                    getOrgUrl: 'https://gitlab.com/NotAlexWhiteCorp-1',

                    getName: 'project-2',
                    getRepoUrl: 'https://gitlab.com/NotAlexWhiteCorp-1/project-2',
                    getPullRequests: 1,
                    isNotFound: false,

                    isOwner: false,
                    isReviewer: true,
                    isViewedByUser: false,
                    isApproved: true,
                    isApprovedByUser: true,
                    getApprovesCount: 2,
                    getTotalDiscussionsCount: 1,
                    getActiveDiscussionsCount: 0,
                    getPRUrl: 'https://gitlab.com/NotAlexWhiteCorp-1/project-2/-/merge_requests/2',
                    getPRId: 2,
                    getPRTitle: 'Merge Request 2 Title',
                    getPRLastUpdate: '2022-07-24T11:11:49Z',
                    isNeedAttention: true,
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
                    const orgConfig = ModelMapper.map(test.orgInfo, OrganizationConfig)
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

                        org = await service.getOrganization(orgConfig)
                        repository = org.groups[0].repositories[0]
                        pullRequest = repository.getPullRequests()[0]
                    })

                    it('Organization model should contains web url', async () => {
                        expect(org.getUrl()).toBe(test.expected.getOrgUrl)
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
                        it('Check PullRequest::getTotalDiscussionsCount should return all discussions count', () => {
                            expect(pullRequest.getTotalDiscussionsCount()).toBe(test.expected.getTotalDiscussionsCount)
                        })
                        it('Check PullRequest::getActiveDiscussionsCount should return count of resolved discussions or discussions which last comment author is PR\'s author', () => {
                            expect(pullRequest.getActiveDiscussionsCount()).toBe(test.expected.getActiveDiscussionsCount)
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

                    it('isNeedAttention should return true if all PRs are approved or viewed by local user', () => {
                        expect(isNeedAttention([org])).toBe(test.expected.isNeedAttention)
                    })
                })
            }
        })
    }
})