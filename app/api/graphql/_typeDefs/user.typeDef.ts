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

    likedComments: [String]

    hidePins: [Pin]
    blockUsers: [User]
  }

  # --------------------------------------------------------------------------------------------------
  type Mutation {
    savePin(userId: ID!, pinId: ID! ): [String]
    unsavePin(userId: ID!, pinId: ID! ): [String]

    followUser(userId: ID!, targetUserId: ID!, path: String): [String]
    unfollowUser(userId: ID!, targetUserId: ID!, path: String): [String]

    
    likeComment(userId: ID!, commentId: ID!, path: ID!): [String]
    unlikeComment(userId: ID!, commentId: ID!, path: ID!): [String]
  }
`
export default userDefs
