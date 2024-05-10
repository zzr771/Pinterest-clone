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
    reaction: String!
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
  }
`

export default pinDefs
