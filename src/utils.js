export const isWindows = () => process.platform === 'win32'

export const isMac = () => process.platform === 'darwin'

export const dateFormatted = (value) => {
    const date = new Date(value)
    const localTime = date.toLocaleTimeString()
    const localDate = date.toLocaleDateString().replaceAll('/', '.')

    return `${localTime} ${localDate}`
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