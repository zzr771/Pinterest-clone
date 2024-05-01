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

export const SAVE_PIN = gql`
  mutation SavePin($userId: ID!, $pinId: ID!) {
    savePin(userId: $userId, pinId: $pinId)
  }
`
export const UNSAVE_PIN = gql`
  mutation UnsavePin($userId: ID!, $pinId: ID!) {
    unsavePin(userId: $userId, pinId: $pinId)
  }
`

const pinRequests: ApolloRequest = {
  FETCH_PINS,
  SAVE_PIN,
  UNSAVE_PIN,
}
export default pinRequests
