export const GITHUB_CURRENT_USER_QUERY = `
    query { 
      viewer { 
        login
      }
    }
`

export const GITHUB_REPOSITORY_QUERY = `
    query Repository($owner: String!, $name: String!){ 
      repository(owner: $owner, name: $name) { 
        name
        url
        owner {
          login
        }
        pullRequests(states: [OPEN], first: 100){
          edges {
            node {
              number
              title
              url
              isDraft
              updatedAt
              author {
                login
              }
              reviewRequests(first: 100) {
                edges {
                  node {
                    requestedReviewer {
                      ... on User {
                        login                    
                      }
                    }
                  }
                }
              }
              reviews(states: [APPROVED, CHANGES_REQUESTED, COMMENTED], first: 100) {
                edges {
                  node {
                    state
                    author {
                      login
                    }
                  }
                }
              }
              reviewThreads(first: 100){
                edges {
                  node {
                    isResolved
                    comments(first: 25) {
                      edges {
                        node {
                          author {
                            login
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
              iid
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
                    resolved
                    notes {
                      edges {
                        node {
                          system
                          body
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