import { DocumentNode } from "graphql"
import { gql } from "graphql-tag"

interface ApolloRequest {
  [key: string]: DocumentNode
}

export const FETCH_PINS = gql`
  query FetchPins($currentNumber: Int!, $limit: Int!) {
    pins(currentNumber: $currentNumber, limit: $limit) {
      _id
      author {
        _id
        username
        imageUrl
      }
      imageUrl
      imageSize {
        width
        height
      }
      title
      link
    }
  }
`
const pinRequests: ApolloRequest = {
  FETCH_PINS,
}
export default pinRequests
