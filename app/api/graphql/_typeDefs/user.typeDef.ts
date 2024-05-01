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
    savePin(userId:ID!, pinId: ID! ): [ID]
    unsavePin(userId:ID!, pinId: ID! ): [ID]
  }

`
export default userDefs
