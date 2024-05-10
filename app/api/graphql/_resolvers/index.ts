import { mergeResolvers } from "@graphql-tools/merge"
import pinResolver from "./pin.resolver"
import userResolver from "./user.resolver"
import commentResolver from "./comment.resolver"

const mergedResolvers = mergeResolvers([pinResolver, userResolver, commentResolver])
export default mergedResolvers
