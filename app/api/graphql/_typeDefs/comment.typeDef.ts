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
    comment(input: commentInput!): [Comment]
    editComment(pinId: ID!, commentId: ID!, content: String!): [Comment]
    deleteComment(pinId: ID!, commentId: ID!, commentOnPin: ID!, replyToComment: ID): [Comment]
  }
`
export default commentDefs
