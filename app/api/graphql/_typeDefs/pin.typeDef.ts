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
    pins(currentNumber: Int!, limit: Int!): [Pin]
    pin(pinId:ID!): Pin
  }
  type Mutation {
    updatePin(pin: updatePinInput!): PinInfoBasic
    deletePin(pinId: ID!, userId: ID!): Boolean
    addReaction(pinId: ID!, reactionId: String!, userId: ID!): Boolean
    removeReaction(pinId: ID!, userId: ID!): Boolean
  }
`

export default pinDefs
