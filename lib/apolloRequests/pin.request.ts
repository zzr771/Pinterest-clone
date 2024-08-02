import { DocumentNode } from "graphql"
import { gql } from "graphql-tag"

interface ApolloRequest {
  [key: string]: DocumentNode
}

export const FETCH_PINS = gql`
  query fetchPins($currentNumber: Int!, $limit: Int!) {
    pins(currentNumber: $currentNumber, limit: $limit) {
      _id
      author {
        _id
        firstName
        lastName
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

export const FETCH_USER_CREATED_PINS = gql`
  query fetchUserCreatedPins($userId: ID!, $currentNumber: Int!, $limit: Int!) {
    userCreatedPins(userId: $userId, currentNumber: $currentNumber, limit: $limit) {
      _id
      author {
        _id
        firstName
        lastName
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

export const FETCH_USER_SAVED_PINS = gql`
  query fetchUserSavedPins($userId: ID!, $currentNumber: Int!, $limit: Int!) {
    userSavedPins(userId: $userId, currentNumber: $currentNumber, limit: $limit) {
      _id
      author {
        _id
        firstName
        lastName
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
export const SEARCH_PINS = gql`
  query searchPins($keyword: String!, $currentNumber: Int!, $limit: Int!) {
    searchPins(keyword: $keyword, currentNumber: $currentNumber, limit: $limit) {
      _id
      author {
        _id
        firstName
        lastName
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

export const FETCH_PIN = gql`
  query fetchPin($pinId: ID!) {
    pin(pinId: $pinId) {
      _id
      imageUrl
      title
      description
      link

      imageSize {
        width
        height
      }

      author {
        _id
        firstName
        lastName
        imageUrl
        follower {
          _id
        }
      }

      comments {
        _id
        author {
          _id
          firstName
          imageUrl
        }
        content
        createdAt
        likes
        isReply
        replyToUser {
          _id
          firstName
        }
        commentOnPin
        replyToComment

        replies {
          _id
          author {
            _id
            firstName
            imageUrl
          }
          content
          createdAt
          likes
          isReply
          replyToUser {
            _id
            firstName
          }
          commentOnPin
          replyToComment
        }
      }

      reactions {
        user {
          _id
          firstName
          imageUrl
        }
        reactionId
      }
    }
  }
`

export const UPDATE_PIN = gql`
  mutation updatePin($pin: updatePinInput!) {
    updatePin(pin: $pin) {
      _id
      title
      description
      link
    }
  }
`

export const DELETE_PIN = gql`
  mutation deletePin($pinId: ID!, $userId: ID!) {
    deletePin(pinId: $pinId, userId: $userId)
  }
`

export const ADD_REACTION = gql`
  mutation addReaction($pinId: ID!, $reactionId: String!, $userId: ID!) {
    addReaction(pinId: $pinId, reactionId: $reactionId, userId: $userId)
  }
`
export const REMOVE_REACTION = gql`
  mutation removeReaction($pinId: ID!, $userId: ID!) {
    removeReaction(pinId: $pinId, userId: $userId)
  }
`

const pinRequests: ApolloRequest = {
  FETCH_PINS,
  FETCH_USER_CREATED_PINS,
  FETCH_USER_SAVED_PINS,
  SEARCH_PINS,
}
export default pinRequests
