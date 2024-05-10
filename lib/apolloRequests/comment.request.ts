import { gql } from "@apollo/client"

export const COMMENT = gql`
  mutation comment($input: commentInput!) {
    comment(input: $input) {
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
  }
`
