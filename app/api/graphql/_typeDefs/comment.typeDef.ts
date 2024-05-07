export const commentDefs = `#graphql
  type Comment {
    _id: ID!
    author: User!
    content: String!
    createdAt: Int!
    likes: Int!
    replies: [Comment]
    replyToUser: User

    commentOnPin: ID
    replyToComment: ID
  }
  # --------------------------------------------------------------------------------------------------

`
export default commentDefs
