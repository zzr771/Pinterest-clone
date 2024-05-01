import { DocumentNode } from "graphql"
import { gql } from "graphql-tag"

interface ApolloRequest {
  [key: string]: DocumentNode
}

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
const userRequests: ApolloRequest = {
  SAVE_PIN,
  UNSAVE_PIN,
}
export default userRequests
