const pinDefs = `#graphql
  type Pin {
    _id: ID!
    author: User!
    imageUrl: String!
    imageSize: ImageSize!
    title: String
    description: String
    link: String
    createdAt: Int!

    comments: [Comment]
    reactions: [Reaction]
  }

  type ImageSize {
    width: Int!
    height: Int!
  }
  type Reaction {
    user: ID!
    reaction: String!
  }

  # --------------------------------------------------------------------------------------------------
  type Query {
    pins(currentNumber: Int!, limit: Int!): [Pin]
    pin(id:ID!): Pin
  }
`

export default pinDefs
