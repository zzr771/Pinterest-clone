export const userDefs = `#graphql
  type User {
    _id: ID!
    id: ID!
    imageUrl: String!
    firstName: String!
    lastName: String
    about: String
    website: String
    username: String!
    
    created: [Pin]
    saved: [Pin]

    following: [User]
    follower: [User]

    hidePins: [Pin]
    blockUsers: [User]
  }

  # --------------------------------------------------------------------------------------------------
  type Query {
    user(id:ID!): User
  }
  
  type Mutation {
    savePin(userId:ID!, pinId: ID! ): MutationResult
    unsavePin(userId:ID!, pinId: ID! ): MutationResult

    followUser(userId:ID!,targetUserId: ID!, path: String): MutationResult
    unfollowUser(userId:ID!,,targetUserId: ID!, path: String): MutationResult
  }

  type MutationResult {
    success: Boolean!
    message: String
  }
`
export default userDefs
