const pinDefs = `#graphql
  type Pin {
    _id: ID!
    author: User!
    imageUrl: String!
    imageSize: ImageSize!
    title: String
    description: String
    link: String
    createdAt: String!

    comments: [Comment]
    reactions: [Reaction]
  }

  type ImageSize {
    width: Int!
    height: Int!
  }
  type Reaction {
    user: User!
    reactionId: String!
  }
  input updatePinInput {
    _id: ID!
    title: String
    description: String
    link: String
  }
  type PinInfoBasic{
    _id: ID!
    title: String
    description: String
    link: String
  }

  # --------------------------------------------------------------------------------------------------
  type Query {
    pin(pinId:ID!): Pin
    pins(currentNumber: Int!, limit: Int!): [Pin]
    userCreatedPins(userId: ID!, currentNumber: Int!, limit: Int!): [Pin]
    userSavedPins(userId: ID!, currentNumber: Int!, limit: Int!): [Pin]
    searchPins(keyword: String!, currentNumber: Int!, limit: Int!): [Pin]
  }
  type Mutation {
    updatePin(pin: updatePinInput!): PinInfoBasic
    deletePin(pinId: ID!, userId: ID!): Boolean
    addReaction(pinId: ID!, reactionId: String!, userId: ID!): Boolean
    removeReaction(pinId: ID!, userId: ID!): Boolean
  }
`

export default pinDefs
