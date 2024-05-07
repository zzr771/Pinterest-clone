import { DocumentNode } from "graphql"
import { gql } from "graphql-tag"

interface ApolloRequest {
  [key: string]: DocumentNode
}

export const SAVE_PIN = gql`
  mutation savePin($userId: ID!, $pinId: ID!) {
    savePin(userId: $userId, pinId: $pinId) {
      success
      message
    }
  }
`
export const UNSAVE_PIN = gql`
  mutation unsavePin($userId: ID!, $pinId: ID!) {
    unsavePin(userId: $userId, pinId: $pinId) {
      success
      message
    }
  }
`

export const FOLLOW = gql`
  mutation followUser($userId: ID!, $targetUserId: ID!) {
    followUser(userId: $userId, targetUserId: $targetUserId) {
      success
      message
    }
  }
`
export const UNFOLLOW = gql`
  mutation unfollowUser($userId: ID!, $targetUserId: ID!) {
    unfollowUser(userId: $userId, targetUserId: $targetUserId) {
      success
      message
    }
  }
`

const userRequests: ApolloRequest = {
  SAVE_PIN,
  UNSAVE_PIN,
}
export default userRequests
