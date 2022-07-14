export const isWindows = () => process.platform === 'win32'

export const dateFormatted = (value) => {
    const date = new Date(value)
    return `${getDateValue(date.getHours())}:${getDateValue(date.getMinutes())} ${getDateValue(date.getDay())}.${getDateValue(date.getMonth())}.${date.getFullYear()}`
}

const getDateValue = (value) => {
    if(value < 10) {
        return '0' + value
    }

    return value
}

export const isAllApproved = (organizations) => {
    return organizations
        .filter(org => org.repositories)
        .every(org => org.repositories
            .flatMap(group => group)
            .flatMap(repo => repo)
            .flatMap(repo => repo.pullRequests)
            .every(pr => pr.isApproved() || pr.isViewedByUser(pr.user.login, org.user.login))
        )
}