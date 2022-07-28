import GitLabService from "@/services/GitLabService";

const PRESET = [
    {
        service: 'GitLab',
        serviceClass: GitLabService
    }
]

describe(`Check logic between API client and displaying data on UI (users)`, () => {
    for (const preset of PRESET) {
        describe(`Check implementation for ${preset.service}`, () => {
            describe('Access token is not valid or expired', () => {
                const service = new preset.serviceClass()
                service.client.api.post = () => Promise.reject(new Error())

                it('Error should be thrown if user can\'t be fetched',  () => {
                    expect(service.getSelfUser()).rejects.toThrow(new Error())
                })
            })

            describe('Current user fetched success', () => {
                const service = new preset.serviceClass()
                const clientResponseMock = require(`./__mocks__/${preset.service}/User.json`)
                service.client.api.post = () => Promise.resolve({
                    data:  clientResponseMock
                })

                it('User model should contains username', async () => {
                    const user = await service.getSelfUser()
                    expect(user.getUsername()).toBe('AlexWhiteCorp')
                })
            })
        })
    }
})