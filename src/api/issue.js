const { gql } =require("@apollo/client/core") ;
exports.getIssues = gql`
query searchIssue($owner: String!, $name: String!){
    repository(owner: $owner,name: $name) {
    issues(states: [OPEN], first: 2, filterBy: { createdBy: $owner }) {
      pageInfo {
        hasPreviousPage
        startCursor
        hasNextPage
        endCursor
      }
      nodes {
          title
          url
          body
          updatedAt
          labels(first: 5) {
            nodes {
                name
            }
          }
        
      }
    }
  }
}
`
;

exports.getNextIssues = gql`

query getNextIssues($owner: String!, $name: String!,$cursor: String){
    repository(owner: $owner,name: $name) {
    issues(states: [OPEN], first: 10, filterBy: { createdBy: $owner },after: $cursor) {
      pageInfo {
        hasPreviousPage
        startCursor
        hasNextPage
        endCursor
      }
      nodes {
          title
          url
          body
          updatedAt
          labels(first: 5) {
            nodes {
                name
            }
        }
      }
    }
  }
}
`
exports.test = gql`
  query {
    viewer {
      login
    }
  }
`;
