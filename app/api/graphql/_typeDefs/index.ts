import { mergeTypeDefs } from "@graphql-tools/merge"
import pinDefs from "./pin.typeDef"
import userDefs from "./user.typeDef"
import commentDefs from "./comment.typeDef"

const mergedTypeDefs = mergeTypeDefs([pinDefs, userDefs, commentDefs])
export default mergedTypeDefs
