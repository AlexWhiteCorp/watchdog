export const GITLAB_CURRENT_USER_QUERY = `
    query User{
      currentUser {
        username
      }
    }
`

export const GITLAB_PROJECT_QUERY = `
    query Project($fullPath: ID!){
      project(fullPath: $fullPath) {
        fullPath,
        webUrl  
        mergeRequests(state: opened) {
          edges {
            node {
              title
              webUrl
              updatedAt
              author {
                username
              }
              reviewers {
                edges {
                  node {
                    username
                  }
                }
              }
              approvedBy {
                edges {
                  node {
                    username
                  }
                }
              }
              discussions {
                edges{
                    node{
                    resolvable
                    resolved
                    notes {
                      edges {
                        node {
                          author {
                            username
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
`