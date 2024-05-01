import { mergeResolvers } from "@graphql-tools/merge"
import pinResolver from "./pin.resolver"
import userResolver from "./user.resolver"

const mergedResolvers = mergeResolvers([pinResolver, userResolver])
export default mergedResolvers
