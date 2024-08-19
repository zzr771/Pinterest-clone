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
  }
`

export const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: ID!, $commentOnPin: ID!, $replyToComment: ID) {
    deleteComment(commentId: $commentId, commentOnPin: $commentOnPin, replyToComment: $replyToComment)
  }
`

export const EDIT_COMMENT = gql`
  mutation editComment($pinId: ID!, $commentId: ID!, $content: String!) {
    editComment(pinId: $pinId, commentId: $commentId, content: $content) {
      _id
      content
    }
  }
`
