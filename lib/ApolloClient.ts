// This file's export is used in server side components
// https://github.com/apollographql/apollo-client-nextjs
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc"

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // this needs to be an absolute url, as relative urls cannot be used in SSR
      uri:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/api/graphql"
          : process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
    }),
  })
})
