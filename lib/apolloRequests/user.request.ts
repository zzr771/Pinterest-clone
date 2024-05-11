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
  mutation followUser($userId: ID!, $targetUserId: ID!, $path: String) {
    followUser(userId: $userId, targetUserId: $targetUserId, path: $path) {
      success
      message
    }
  }
`
export const UNFOLLOW = gql`
  mutation unfollowUser($userId: ID!, $targetUserId: ID!, $path: String) {
    unfollowUser(userId: $userId, targetUserId: $targetUserId, path: $path) {
      success
      message
    }
  }
`

export const LIKE_COMMENT = gql`
  mutation likeComment($userId: ID!, $commentId: ID!, $pinId: ID!) {
    likeComment(userId: $userId, commentId: $commentId, pinId: $pinId) {
      success
      message
    }
  }
`

export const UNLIKE_COMMENT = gql`
  mutation unlikeComment($userId: ID!, $commentId: ID!, $pinId: ID!) {
    unlikeComment(userId: $userId, commentId: $commentId, pinId: $pinId) {
      success
      message
    }
  }
`
