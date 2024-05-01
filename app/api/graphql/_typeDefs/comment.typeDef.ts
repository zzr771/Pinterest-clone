export const commentDefs = `#graphql
  type Comment {
    _id: ID!
    author: User!
    pin: Pin!
    content: String!
    createdAt: Int!
    likes: Int!
    replyToComment: ID
    replyToUser: ID
    replies: [Comment]
  }
  # --------------------------------------------------------------------------------------------------

`
export default commentDefs
