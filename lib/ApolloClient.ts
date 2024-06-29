// This file's export is used in server side components
// https://github.com/apollographql/apollo-client-nextjs
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc"

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // todo: replace this uri with deployed address
      // this needs to be an absolute url, as relative urls cannot be used in SSR
      uri: "http://localhost:3000/api/graphql",
    }),
  })
})
