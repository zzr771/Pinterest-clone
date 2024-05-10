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

        replies {
          author {
            _id
            firstName
            imageUrl
          }
          content
          createdAt
          likes
        }
        replyToUser {
          _id
          firstName
        }
        commentOnPin
        replyToComment
      }

      reactions {
        user {
          _id
          firstName
          lastName
          imageUrl
        }
        reaction
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

const pinRequests: ApolloRequest = {
  FETCH_PINS,
  FETCH_PIN,
}
export default pinRequests
