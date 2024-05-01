import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { NextRequest } from "next/server"
import { ApolloServer } from "@apollo/server"
import Pin from "@/lib/models/pin.model"
import User from "@/lib/models/user.model"
import Comment from "@/lib/models/comment.model"
import mergedResolvers from "./_resolvers/index"
import mergedTypeDefs from "./_typeDefs/index"
import { connectToDB } from "@/lib/mongoose"

/*
    This line of code is only for causing the model files to be executed.
    By using these models, those 'xxx.model' files will be executed and models will be registered in mongoose,
  whick enables us to use these models in resolvers.
*/
const models = [Pin, User, Comment]

connectToDB()

const server = new ApolloServer({
  resolvers: mergedResolvers,
  typeDefs: mergedTypeDefs,
})

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
})

export { handler as GET, handler as POST }
