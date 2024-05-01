import { connectToDB } from "@/lib/mongoose"
import Pin from "@/lib/models/pin.model"
import User from "@/lib/models/user.model"
import Comment from "@/lib/models/comment.model"

const pinResolver = {
  Query: {
    async pins(_: any, args: { currentNumber: number; limit: number }) {
      // we don't use field resolver here, because it will send one request for each pin. While we need to fetch dozens of pins
      const pins = await Pin.find({})
        .sort({ createdAt: "desc" })
        .skip(args.currentNumber)
        .limit(args.limit)
        .populate({ path: "author", select: "_id username imageUrl" })
      return pins
    },
  },

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

export default pinResolver
