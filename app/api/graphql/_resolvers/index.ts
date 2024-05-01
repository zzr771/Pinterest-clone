import { mergeResolvers } from "@graphql-tools/merge"
import pinResolver from "./pin.resolver"

const mergedResolvers = mergeResolvers([pinResolver])
export default mergedResolvers
