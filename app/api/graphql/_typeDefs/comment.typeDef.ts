export const commentDefs = `#graphql
  type Comment {
    _id: ID!
    author: User!
    content: String!
    createdAt: String!
    likes: Int!
    isReply: Boolean!
    replies: [Comment]
    replyToUser: User

    commentOnPin: ID
    replyToComment: ID
  }
  type CommentContent {
    _id: ID!
    content: String!
  }

  input commentInput {
    pinId: ID!
    userId: ID!
    content: String!
    isReply: Boolean!
    replyToUser:ID
    replyToComment:ID
  }
  # --------------------------------------------------------------------------------------------------
  type Mutation {
    comment(input: commentInput!): Comment
    editComment(pinId: ID!, commentId: ID!, content: String!): CommentContent
    deleteComment(commentId: ID!, commentOnPin: ID!, replyToComment: ID): Boolean
  }
`
export default commentDefs
