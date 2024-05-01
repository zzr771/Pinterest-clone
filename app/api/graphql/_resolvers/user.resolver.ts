import Pin from "@/lib/models/pin.model"
import User from "@/lib/models/user.model"

const userResolver = {
  Mutation: {
    async savePin(_: any, args: { userId: number; pinId: number }) {
      // $addToSet: if an item is already in the array, it won't be added again
      await User.findOneAndUpdate({ _id: args.userId }, { $addToSet: { saved: args.pinId } })
      const user = await User.findOne({ _id: args.userId }, ["saved"])
      return user.saved
    },
    async unsavePin(_: any, args: { userId: number; pinId: number }) {
      await User.findOneAndUpdate({ _id: args.userId }, { $pull: { saved: args.pinId } })
      const user = await User.findOne({ _id: args.userId }, ["saved"])
      return user.saved
    },
  },
}

export default userResolver
